import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.servicetest';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { UserService } from '../services/User.Service';

@Component({
  selector: 'app-life',
  templateUrl: './life.page.html',
  styleUrls: ['./life.page.scss', '../app.component.scss'],
})
export class LifePage implements OnInit {
  racks = ['Rack 1 S1', 'Rack 2 S1', 'Rack 3 S1', 'Rack 4 S1',  'Rack 1 S2', 'Rack 2 S2', 'Rack 3 S2', 'Rack 4 S2'];

 
  consumables: any[] = [];
  visibleRacks: { [key: string]: boolean } = {};

  constructor(
    private userService: UserService,
    private router: Router,
    private firebaseService: FirebaseService,
    private alertController: AlertController
  ) {}

  
  ngOnInit() {
   
  }

ionViewWillEnter() {
  const user = this.userService.getUser();
  if (!user) {
    this.router.navigate(['/dashboard']);
  } else {
    this.loadConsumables(); // Refresca los datos cada vez que se ingresa a la página
  }
}

  getRowStart(index: number): number {
    return Math.ceil((index + 1) / 10);
  }
  logout() {
    this.userService.clearUser();
    this.router.navigate(['/dashboard']);
  }

  toggleRackVisibility(rack: string) {
    this.visibleRacks[rack] = !this.visibleRacks[rack];
  }

  isRackVisible(rack: string): boolean {
    return !!this.visibleRacks[rack];
  }
  loadConsumables() {
    this.consumables = []; // Limpia la lista de consumibles antes de cargar nuevos datos
    this.racks.forEach((rack) => {
      this.firebaseService.getCollectionlife(rack).subscribe((data) => {
        const rackConsumables = data.map((item: any) => {
          const initializationDate = moment(item.initializationDate);
          const yearsOfLife = item.yearsOfLife;
          const endDate = initializationDate.clone().add(yearsOfLife, 'years');
          const currentDate = moment();
          const lifecyclePercentage = Math.min(
            ((currentDate.diff(initializationDate, 'days') /
              endDate.diff(initializationDate, 'days')) *
              100),
            100
          );
          let status = 'OK';
          if (lifecyclePercentage >= 100) {
            status = 'Replace';
          } else if (lifecyclePercentage >= 90) {
            status = 'Soon';
          }
          return {
            ...item,
            rack,
            lifecyclePercentage,
            status,
            cssClass: this.getConsumableClass(status),
          };
        });
  
        // Reemplaza los consumables del rack actual en lugar de concatenarlos
        this.consumables = [
          ...this.consumables.filter(c => c.rack !== rack),
          ...rackConsumables
        ];
      });
    });
  }
  
  getConsumableClass(status: string): string {
    switch (status) {
      case 'Soon':
        return 'soon';
      case 'Replace':
        return 'replace';
      default:
        return '';
    }
  }

  async resetInitializationDate(consumable: any) {
    const alert = await this.alertController.create({
      header: 'Reset Life Cycle',
      inputs: [
        {
          name: 'employeeNumber',
          type: 'text',
          placeholder: 'Enter Employee Number',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Reset',
          handler: async (data) => {
            if (data.employeeNumber) {
              const updatedData = {
                ...consumable,
                initializationDate: moment().format('YYYY-MM-DD'),
              };
              await this.firebaseService.updateDocument(
                consumable.rack,
                consumable.id,
                updatedData
              );
              await this.firebaseService.setCollection('historycicle', {
                rack: consumable.rack,
                consumable: consumable.name,
                employeeNumber: data.employeeNumber,
                date: moment().format('YYYY-MM-DD'),
              });
              this.loadConsumables();
              return true; // Return true to close the alert
            } else {
              return false; // Prevent closing the alert if input is empty
            }
          },
        },
      ],
    });
    await alert.present();
  }

  getRackClass(rack: string): string {
    const hasSoon = this.consumables.some(c => c.rack === rack && c.status === 'Soon');
    const hasReplace = this.consumables.some(c => c.rack === rack && c.status === 'Replace');
    
    if (hasReplace) {
      return 'replace';
    
    
    } else if (hasSoon) {
      return 'soon';
    }
    return '';
  }

  getButtonClass(rack: string): string {
    const hasSoon = this.consumables.some(c => c.rack === rack && c.status === 'Soon');
    const hasReplace = this.consumables.some(c => c.rack === rack && c.status === 'Replace');

    if (hasReplace) {
      return 'red-button';
    } else if (hasSoon) {
      return 'yellow-button';
    } else {
      return 'default-button';
    }
  }


}
