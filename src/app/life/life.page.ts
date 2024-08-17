import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular'; // Import AlertController
import { FirebaseService } from '../services/firebase.servicetest';

interface ConsumableDocument {
  Id: string;
  name: string;
  initializationDate: string;
  yearsOfLife: number;
  partNumber: string;
  lifecyclePercentage?: number;
  status?: string;
}

@Component({
  selector: 'app-life',
  templateUrl: './life.page.html',
  styleUrls: ['./life.page.scss'],
})
export class LifePage implements OnInit {
  collections: Array<{ name: string, documents: ConsumableDocument[] }> = [];

  constructor(private firebaseService: FirebaseService, private alertController: AlertController) {}

  ngOnInit() {
    this.loadCollections();
  }

  loadCollections() {
    this.collections = []; // Clear the array to avoid duplication
    console.log('Loading collections...');

    this.firebaseService.getCollections().subscribe((collectionNames: string[]) => {
      console.log('Collection names:', collectionNames);

      collectionNames.forEach((collectionName) => {
        this.firebaseService.getCollectionData(collectionName)
          .subscribe((documents) => {
            const typedDocuments = documents as ConsumableDocument[]; // Type assertion

            console.log(`Documents in ${collectionName}:`, typedDocuments);
          
            // Calculate lifecycle percentage and status for each document
            typedDocuments.forEach((document) => {
              document.lifecyclePercentage = this.calculateLifecyclePercentage(document.initializationDate, document.yearsOfLife);
              document.status = this.determineStatus(document.lifecyclePercentage);
            });

            this.collections.push({ name: collectionName, documents: typedDocuments });
          });
      });
    });
  }

  calculateLifecyclePercentage(initializationDate: string, yearsOfLife: number): number {
    const initDate = new Date(initializationDate);
    const currentDate = new Date();
    const totalTime = yearsOfLife * 365 * 24 * 60 * 60 * 1000; // Convert years to milliseconds
    const elapsedTime = currentDate.getTime() - initDate.getTime();

    const percentage = (elapsedTime / totalTime) * 100;

    return Math.min(Math.max(percentage, 0), 100); // Ensure percentage is between 0 and 100
  }

  determineStatus(percentage: number): string {
    if (percentage < 90) {
      return 'OK';
    } else if (percentage >= 90 && percentage < 100) {
      return 'soon';
    } else {
      return 'Replace';
    }
  }

  async resetInitializationDate(document: ConsumableDocument, collectionName: string) {
    const alert = await this.alertController.create({
      header: 'Reset Initialization Date',
      inputs: [
        {
          name: 'clockNumber',
          type: 'text',
          placeholder: 'Enter Clock Number',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Accept',
          handler: (data) => {
            if (data.clockNumber) {
              const newInitDate = new Date().toISOString();
              document.initializationDate = newInitDate;
  
              // Verify if the document exists before updating
              this.firebaseService.getDocument2(collectionName, document.Id)
                .then((doc) => {
                  if (doc.exists) {
                    // Update the document in the Firebase database
                    this.firebaseService.updateDocument(collectionName, document.Id, { initializationDate: newInitDate })
                      .then(() => {
                        // Recalculate the lifecycle percentage after the date reset
                        document.lifecyclePercentage = this.calculateLifecyclePercentage(document.initializationDate, document.yearsOfLife);
                        document.status = this.determineStatus(document.lifecyclePercentage);
                        console.log('Initialization date reset successfully');
                      })
                      .catch((error) => {
                        console.error('Error resetting initialization date:', error);
                      });
                  } else {
                    console.error(`No document with ID ${document.Id} found in collection ${collectionName}`);
                  }
                })
                .catch((error) => {
                  console.error('Error retrieving document:', error);
                });
  
              return true; // Return true to close the alert
            } else {
              return false; // Prevent the alert from dismissing if the input is empty
            }
          },
        },
      ],
    });
  
    await alert.present();
  }
  
}  