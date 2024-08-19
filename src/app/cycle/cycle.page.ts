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

  selectedRack: string = 'Rack1'; // Inicializa con un valor por defecto.
  consumables: any[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private firebaseService: FirebaseService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const user = this.userService.getUser();
    if (!user) {
      this.router.navigate(['/dashboard']);
    }

    this.loadConsumables();
    
  }
  logout() {
    this.userService.clearUser();
    this.router.navigate(['/dashboard']);
  }

  loadConsumables() {
    this.firebaseService.getCollectionlife(this.selectedRack).subscribe(data => {
      this.consumables = data as any[];
    });
  }

  selectRack(rack: string | undefined) {
    this.selectedRack = rack || 'Rack1'; // Asigna un valor por defecto si es undefined
    this.loadConsumables();
  }

  async addConsumable() {
    const alert = await this.alertController.create({
      header: 'Add Consumable',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Consumable Name'
        },
        {
          name: 'partNumber',
          type: 'text',
          placeholder: 'Part Number'
        },
        {
          name: 'initializationDate',
          type: 'date',
          placeholder: 'Initialization Date'
        },
        {
          name: 'yearsOfLife',
          type: 'number',
          placeholder: 'Years of Life'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Add',
          handler: async (data) => {
            if (data.name && data.partNumber && data.initializationDate && data.yearsOfLife) {
              // Generate a unique ID for the new consumable
              const newId = this.firebaseService.generateDocId(this.selectedRack);
  
              const newConsumable = {
                id: newId,
                name: data.name,
                partNumber: data.partNumber,
                initializationDate: data.initializationDate,
                yearsOfLife: data.yearsOfLife
              };
  
              // Save the new consumable with the generated ID
              await this.firebaseService.setCollectionlife(this.selectedRack, newConsumable, newId);
              this.loadConsumables();
            }
          }
        }
      ]
    });
    await alert.present();
  }
  

  async updateConsumable(consumable: any) {
    const alert = await this.alertController.create({
      header: 'Update Consumable',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: consumable.name,
          placeholder: 'Consumable Name'
        },
        {
          name: 'partNumber',
          type: 'text',
          value: consumable.partNumber,
          placeholder: 'Part Number'
        },
        {
          name: 'initializationDate',
          type: 'date',
          value: consumable.initializationDate,
          placeholder: 'Initialization Date'
        },
        {
          name: 'yearsOfLife',
          type: 'number',
          value: consumable.yearsOfLife,
          placeholder: 'Years of Life'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Update',
          handler: async (data) => {
            if (data.name && data.partNumber && data.initializationDate && data.yearsOfLife) {
              const updatedConsumable = {
                name: data.name,
                partNumber: data.partNumber,
                initializationDate: data.initializationDate,
                yearsOfLife: data.yearsOfLife
              };
              await this.firebaseService.updateDocument(this.selectedRack, consumable.id, updatedConsumable);
              this.loadConsumables();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteConsumable(consumableId: string) {
    await this.firebaseService.deleteDocument(this.selectedRack, consumableId);
    this.loadConsumables();
  }


}
