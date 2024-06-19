import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { UserService } from '../services/User.Service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-c1counter',
  templateUrl: './c1counter.page.html',
  styleUrls: ['./c1counter.page.scss'],
})
export class C1counterPage implements OnInit {
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
    this.checkUserAndLoadData();
  }

  ionViewWillEnter() {
    this.checkUserAndLoadData();
  }

  checkUserAndLoadData() {
    const user = this.userService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
    } else {
      this.loadConsumables();
    }
  }

  async checkLevels(consumable: any, action: string) {
    const total = consumable.Total;
    const minLevel = consumable.MinimumLevel;
    const maxLevel = consumable.MaximumLevel;

    let alertLevel = '';

    if (action === 'decrease') {
      if (total === 0) {
        alertLevel = 'zero';
      } else if (total <= minLevel * 0.15) {
        alertLevel = 'low_1';
      } else if (total <= minLevel * 0.50) {
        alertLevel = 'low_50%';
      } else if (total <= minLevel) {
        alertLevel = 'low';
      }
    } else if (action === 'increase') {
      if (total >= maxLevel) {
        alertLevel = 'high';
      } else if (total >= maxLevel * 0.75) {
        alertLevel = 'high_75%';
      }
    }

    if (alertLevel && !this.alertShown[`${consumable.Id}_${alertLevel}`]) {
      this.resetAlert(consumable.Id, alertLevel);
      this.alertShown[`${consumable.Id}_${alertLevel}`] = true;
      await this.presentStockAlert(consumable, alertLevel);
    }
  }

  resetAlert(consumableId: string, level: string) {
    this.alertShown[`${consumableId}_${level}`] = false;
  }

  async presentStockAlert(consumable: any, level: string) {
    let message: string;
    switch (level) {
      case 'low':
        message = `The consumable "${consumable.Consumable}" has reached the minimum level. Please order more.`;
        break;
      case 'high':
        message = `The consumable "${consumable.Consumable}" has reached the maximum level. Please store it elsewhere.`;
        break;
      case 'low_50%':
        message = `The consumable "${consumable.Consumable}" is at 50% of the minimum level. Please consider ordering more.`;
        break;
      case 'high_75%':
        message = `The consumable "${consumable.Consumable}" is at 75% of the maximum level. Please monitor stock.`;
        break;
      case 'low_1':
        message = `The consumable "${consumable.Consumable}" is about to run out. Please order immediately.`;
        break;
      case 'zero':
        message = `The consumable "${consumable.Consumable}" has run out. Immediate action required.`;
        break;
      default:
        message = '';
    }

    const alert = await this.alertController.create({
      header: 'Stock Alert',
      message: message,
      backdropDismiss: false, 
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Reason for the stock change',
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
  
              this.alertController.create({
                header: 'Validation Error',
                message: 'Reason is required.',
                buttons: ['OK']
              }).then(alert => alert.present());
              return false; // Prevent the alert from closing
            }

            const action = level.includes('low') || level === 'zero' ? 'decrease' : 'increase';
            this.firebaseService.setHistory('HistoryC1', {
              user: this.userService.getUser(),
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

  loadConsumables() {
    this.firebaseService.getCollection('consumables').subscribe((data: any[]) => {
      this.consumables = data;
      this.filterConsumables();
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
  }

  updateTotal(consumable: any, newTotal: number, action: string) {
    if (newTotal < 0) {
      return;
    }

    const updatedConsumable = {
      ...consumable,
      Total: newTotal
    };

    this.firebaseService.update(`consumables/${consumable.Id}`, updatedConsumable)
      .then(() => {
        consumable.Total = newTotal;
        this.checkLevels(consumable, action);
      })
      .catch((error) => {
        console.error('Error updating consumable:', error);
      });
  }

  increment(consumable: any) {
    const newTotal = consumable.Total + 1;
    this.updateTotal(consumable, newTotal, 'increase');
  }

  decrement(consumable: any) {
    const newTotal = consumable.Total - 1;
    if (newTotal >= 0) {
      this.updateTotal(consumable, newTotal, 'decrease');
    }
  }

  handleScanInput(consumable: any, action: string, event: any) {
    const scannedPartNumber = event.target.value;
    if (scannedPartNumber && scannedPartNumber === consumable.PartNumber) {
      if (action === 'increase') {
        this.increment(consumable);
      } else if (action === 'decrease') {
        this.decrement(consumable);
      }
      event.target.value = '';
    }
  }

  logout() {
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }
}
