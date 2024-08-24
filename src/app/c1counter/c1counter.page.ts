import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.servicetest';
import { UserService } from '../services/User.Service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-c1counter',
  templateUrl: './c1counter.page.html',
  styleUrls: ['./c1counter.page.scss', '../app.component.scss'],
})
export class C1counterPage implements OnInit {
  public consumables: any[] = [];
  public filteredConsumables: any[] = [];
  public partNumber: string = '';
  private alertShown: boolean = false; // Flag to prevent multiple alerts

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
      this.router.navigate(['/dashboard']);
    } else {
      this.loadConsumables();
    }
  }

  loadConsumables() {
    this.firebaseService.getCollection('consumables').subscribe((data: any[]) => {
      this.consumables = data;
      this.showActionButtons();
    });
  }

  showActionButtons() {
    if (this.partNumber.length > 0) {
      this.filteredConsumables = this.consumables.filter(consumable =>
        consumable.PartNumber === this.partNumber
      );
      if (this.filteredConsumables.length === 0 && !this.alertShown) {
        this.alertShown = true;
        this.showAlert('Error', 'No consumable matches the provided part number.');
      }
    } else {
      this.alertShown = false; // Reset the alert flag when the input is cleared
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async handleAction(action: string) {
    const consumable = this.filteredConsumables[0];
  
    const alert = await this.alertController.create({
      header: `${action.charAt(0).toUpperCase() + action.slice(1)} Consumable`,
      inputs: [
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'Quantity'
        },
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Reason',
          attributes: {
            required: true
          }
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Submit',
          handler: (data) => {
            const quantity = Number(data.quantity);
            if (!data.reason || isNaN(quantity)) {
              this.alertController.create({
                header: 'Validation Error',
                message: 'Both quantity and reason are required.',
                buttons: ['OK']
              }).then(alert => alert.present());
              return false; // Prevent the alert from closing
            }
  
            const updateData = { ...data, consumable: consumable.Consumable, date: new Date() };
  
            if (action === 'increase') {
              this.updateTotal(consumable, consumable.SubTotal + quantity, 'increase'); 
            } else if (action === 'lend') {
              this.updateTotal(consumable, consumable.SubTotal - quantity, 'decrease');
              this.firebaseService.setCollection('c1lend', updateData);
            } else if (action === 'damage') {
              this.updateTotal(consumable, consumable.SubTotal - quantity, 'decrease');
              this.firebaseService.setCollection('c1damaged', updateData);
            } else if (action === 'endOfLife') {
              this.updateTotal(consumable, consumable.SubTotal - quantity, 'decrease');
              this.firebaseService.setCollection('c1endOfLife', updateData);
            }
  
            this.firebaseService.setCollection('HistoryC1', {
              user: this.userService.getUser(),
              reason: data.reason,
              date: new Date(),
              action: action,
              consumable: consumable,
              quantity: quantity
            });
            return true; // Ensure the alert closes
          }
        }
      ]
    });
  
    await alert.present();
  }
  

  updateTotal(consumable: any, newTotal: number, action: string) {
    if (newTotal < 0) {
      return;
    }

    const updatedConsumable = {
      ...consumable,
      SubTotal: newTotal
    };

    this.firebaseService.update(`consumables/${consumable.Id}`, updatedConsumable)
      .then(() => {
        consumable.SubTotal = newTotal;
      })
      .catch((error) => {
        console.error('Error updating consumable:', error);
      });
  }

  clearScan() {
    this.partNumber = '';
    this.filteredConsumables = [];
    this.alertShown = false; // Reset the alert flag when the input is cleared
  }

  logout() {
    this.userService.clearUser();
    this.router.navigate(['/dashboard']);
  }
}
