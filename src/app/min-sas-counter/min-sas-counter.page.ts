import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.servicetest';
import { UserService } from '../services/User.Service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-min-sas-counter',
  templateUrl: './min-sas-counter.page.html',
  styleUrls: ['./min-sas-counter.page.scss'],
})
export class MinSasCounterPage implements OnInit {
  public consumables: any[] = [];
  public filteredConsumables: any[] = [];
  public partNumber: string = '';
  private alertShown: { [id: string]: boolean } = {};

  constructor(
    public alertController: AlertController,
    private firebaseService: FirebaseService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.userService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
    }else{this.loadConsumables();}
    
    
  }

  ionViewDidEnter() {
    this.checkLevels();
  }

  async checkLevels() {
    for (const consumable of this.consumables) {
      if (consumable.Total <= consumable.MinimumLevel && !this.alertShown[consumable.Id]) {
        this.alertShown[consumable.Id] = true;
        await this.presentStockAlert(consumable.Consumable, 'low');
      } else if (consumable.Total >= consumable.MaximumLevel && !this.alertShown[consumable.Id]) {
        this.alertShown[consumable.Id] = true;
        await this.presentStockAlert(consumable.Consumable, 'high');
      } else if (consumable.Total > consumable.MinimumLevel && consumable.Total < consumable.MaximumLevel) {
        this.alertShown[consumable.Id] = false;
      }
    }
  }

  async presentStockAlert(name: string, level: string) {
    const message = level === 'low' ?
      `The consumable "${name}" is low on stock, please order more.` :
      `The consumable "${name}" has exceeded the required stock, please store it elsewhere.`;

    const alert = await this.alertController.create({
      header: 'Stock Alert',
      message: message,
      buttons: ['Accept']
    });

    await alert.present();
  }

  loadConsumables() {
    this.firebaseService.getCollection('MiniSAS').subscribe((data: any[]) => {
      this.consumables = data;
      this.filteredConsumables = data;
      this.checkLevels();
    });
  }

  filterConsumables() {
    if (this.partNumber) {
      this.filteredConsumables = this.consumables.filter(consumable =>
        consumable.PartNumber.toLowerCase().includes(this.partNumber.toLowerCase())
      );
    } else {
      this.filteredConsumables = this.consumables;
    }
    this.checkLevels(); 
  }

  async presentAlert(consumable: any, action: string) {
    const user = this.userService.getUser();
    const alert = await this.alertController.create({
      header: `Explain the reason for the ${action} of consumables`,
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: `Reason for ${action}`,
          attributes: {
            required: true 
          }
        }
      ],
      buttons: [
        {
          text: 'Accept',
          handler: (data) => {
            if (!data.reason) {
              return false;
            }

            let newTotal = action === 'increase' ? consumable.Total + 1 : consumable.Total - 1;
            if (newTotal < 0) {
              return false;
            }
            this.updateTotal(consumable, newTotal, data.reason);
            this.firebaseService.setHistory('HistoryMiniSas', {
              user: user, 
              reason: data.reason,
              date: new Date(),
              action: action,
              consumable: consumable
            });
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  updateTotal(consumable: any, newTotal: number, reason: string) {
    if (newTotal < 0) {
      return;
    }

    const updatedConsumable = {
      ...consumable,
      Total: newTotal
    };

    this.firebaseService.update(`MiniSAS/${consumable.Id}`, updatedConsumable)
      .then(() => {
        
        consumable.Total = newTotal;
        this.checkLevels();
      })
      .catch((error) => {
        console.error('Error updating consumable:', error);
      });
  }

  increment(consumable: any) {
    this.presentAlert(consumable, 'increase');
  }

  decrement(consumable: any) {
    this.presentAlert(consumable, 'decrease');
  }

  logout() {
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }
}

