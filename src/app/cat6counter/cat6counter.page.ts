import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.servicetest';
import { UserService } from '../services/User.Service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cat6counter',
  templateUrl: './cat6counter.page.html',
  styleUrls: ['./cat6counter.page.scss'],
})
export class Cat6counterPage implements OnInit {
  public consumables: any[] = [];
  public filteredConsumables: any[] = [];
  public partNumber: string = '';
  private alertShown: { [id: string]: boolean } = {};
  @ViewChildren('scanInput') scanInputs!: QueryList<ElementRef>;
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
    const SubTotal = consumable.SubTotal;
    const minLevel = consumable.MinimumLevel;
    const maxLevel = consumable.MaximumLevel;

    let alertLevel = '';
    const range = maxLevel - minLevel;
    const high20 = maxLevel - range * 0.20;
    const high40 = maxLevel - range * 0.40;
    const high60 = maxLevel - range * 0.60;
    const high80 = maxLevel - range * 0.80;

    if (action === 'decrease') {
      if (SubTotal === 0) {
        alertLevel = 'zero';
      } else if (SubTotal <= minLevel * 0.15) {
        alertLevel = 'low_1';
      } else if (SubTotal <= minLevel * 0.50) {
        alertLevel = 'low_50%';
      } else if (SubTotal <= minLevel) {
        alertLevel = 'low';
      } else if (SubTotal <= high80) {
        alertLevel = 'high_80%';
      } else if (SubTotal <= high60) {
        alertLevel = 'high_60%';
      } else if (SubTotal <= high40) {
        alertLevel = 'high_40%';
      } else if (SubTotal <= high20) {
        alertLevel = 'high_20%';
      }
    } else if (action === 'increase') {
      if (SubTotal >= maxLevel) {
        alertLevel = 'high';
      } else if (SubTotal >= maxLevel * 0.75) {
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
      case 'high_20%':
        message = `The consumable "${consumable.Consumable}" is 20% away from the minimum level. Please check stock.`;
        break;
      case 'high_40%':
        message = `The consumable "${consumable.Consumable}" is 40% away from the minimum level. Please check stock.`;
        break;
      case 'high_60%':
        message = `The consumable "${consumable.Consumable}" is 60% away from the minimum level. Please check stock.`;
        break;
      case 'high_80%':
        message = `The consumable "${consumable.Consumable}" is 80% away from the minimum level. Please check stock.`;
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
            this.firebaseService.setHistory('HistoryCat6', {
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
    this.firebaseService.getCollection('Cat6').subscribe((data: any[]) => {
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
      SubTotal: newTotal
    };

    this.firebaseService.update(`Cat6/${consumable.Id}`, updatedConsumable)
      .then(() => {
        consumable.SubTotal = newTotal;
        this.checkLevels(consumable, action);
      })
      .catch((error) => {
        console.error('Error updating consumable:', error);
      });
  }

  increment(consumable: any) {
    const newTotal = consumable.SubTotal + 1;
    this.updateTotal(consumable, newTotal, 'increase');
  }

  decrement(consumable: any) {
    const newTotal = consumable.SubTotal - 1;
    if (newTotal >= 0) {
      this.updateTotal(consumable, newTotal, 'decrease');
    }
  }

  handleScanInput(consumable: any, action: string, event: any, index: number) {
    const scannedPartNumber = event.target.value;
    if (scannedPartNumber && scannedPartNumber === consumable.PartNumber) {
      if (action === 'increase') {
        this.increment(consumable);
      } else if (action === 'decrease') {
        this.decrement(consumable);
      }
      event.target.value = '';
      setTimeout(() => this.scanInputs.toArray()[index].nativeElement.focus(), 0); // Refocus the input field
    }
  }

  logout() {
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }
}
