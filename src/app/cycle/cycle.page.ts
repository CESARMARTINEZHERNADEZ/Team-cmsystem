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

  selectedRack: string = 'Rack 1 S1'; // Inicializa con un valor por defecto.
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
    this.selectedRack = rack || 'Rack 1 S1'; // Asigna un valor por defecto si es undefined
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
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this consumable?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // Acción si el usuario cancela la eliminación
          }
        },
        {
          text: 'Delete',
          handler: async () => {
            // Acción si el usuario confirma la eliminación
            await this.firebaseService.deleteDocument(this.selectedRack, consumableId);
            this.loadConsumables();
          }
        }
      ]
    });
  
    await alert.present();
  }

  async showHistory() {
    const history = await this.firebaseService.getHistorycicle(this.selectedRack);

    const historyText = history.map(item => `
      Consumable: ${item.consumable}
      Date: ${item.date}
      Clocknumber: ${item.employeeNumber}
    
    `).join('\n\n');

    const alert = await this.alertController.create({
      header: 'Historycicle',
      message: historyText || 'No history available',
      buttons: ['OK']
    });

    await alert.present();
}

  private generateHistoryTable(history: any[]): string {
    if (history.length === 0) {
      return 'No history available';
    }

    let table = `
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <th style="border: 1px solid #ccc; padding: 8px;">Consumable</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Date</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Employee Number</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Rack</th>
        </tr>
    `;

    history.forEach(item => {
      table += `
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;">${item.consumable}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${item.date}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${item.employeeNumber}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${item.rack}</td>
        </tr>
      `;
    });

    table += `</table>`;
    return table;
  }
}
