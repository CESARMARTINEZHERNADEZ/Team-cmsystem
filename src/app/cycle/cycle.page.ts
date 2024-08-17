import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.servicetest';
import { Router } from '@angular/router';
import { UserService } from '../services/User.Service';


@Component({
  selector: 'app-cycle',
  templateUrl: './cycle.page.html',
  styleUrls: ['./cycle.page.scss'],
})
export class CyclePage implements OnInit {
  collections: string[] = []; // To store collection names

  constructor(
    private userService: UserService,
    private router: Router,
    private firebaseService: FirebaseService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadCollections(); // Load collections on initialization
  }

  async openCreateCollectionAlert() {
    const alert = await this.alertController.create({
      header: 'Create Collection',
      inputs: [
        {
          name: 'collectionName',
          type: 'text',
          placeholder: 'Enter collection name',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Create',
          handler: (data) => {
            if (data.collectionName) {
              this.createCollection(data.collectionName);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  createCollection(collectionName: string) {
    this.firebaseService.createCollection(collectionName).then(() => {
      this.collections.push(collectionName);
      this.saveCollections(); // Save the updated collections list
    });
  }

  loadCollections() {
    this.firebaseService.getCollections().subscribe((collections: string[]) => {
      this.collections = collections;
    });
  }

  saveCollections() {
    this.firebaseService.saveCollections(this.collections); // Save collections to Firebase or storage
  }

  async openAddConsumableAlert(collectionName: string) {
    const alert = await this.alertController.create({
      header: `Add Consumable to ${collectionName}`,
      inputs: [
        {
          name: 'consumableName',
          type: 'text',
          placeholder: 'Enter consumable name',
        },
        {
          name: 'initializationDate',
          type: 'date',
          placeholder: 'Enter initialization date',
        },
        {
          name: 'yearsOfLife',
          type: 'number',
          placeholder: 'Enter years of life',
        },
        {
          name: 'partNumber',
          type: 'text',
          placeholder: 'Enter part number',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Add',
          handler: (data) => {
            if (data.consumableName && data.initializationDate && data.yearsOfLife && data.partNumber) {
              this.addConsumable(collectionName, data);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  addConsumable(collectionName: string, data: any) {
    const newId = this.firebaseService.firestore.createId();
    const consumable = {
      Id: newId,// Generate a unique ID for the consumable
      name: data.consumableName,
      initializationDate: data.initializationDate,
      yearsOfLife: data.yearsOfLife,
      partNumber: data.partNumber,
    };

    this.firebaseService.addConsumableToCollection(collectionName, consumable);
  }
}
