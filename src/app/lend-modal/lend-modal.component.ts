import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FirebaseService } from '../services/firebase.servicetest';
import { ModalController, AlertController } from '@ionic/angular';
import { UserService } from '../services/User.Service'; 

@Component({
  selector: 'app-lend-modal',
  templateUrl: './lend-modal.component.html',
  styleUrls: ['./lend-modal.component.scss'],
})
export class LendModalComponent implements OnInit {
  toolslendData: any[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private modalController: ModalController,
    private cdr: ChangeDetectorRef,
    private alertController: AlertController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.firebaseService.getToolslendCollection().subscribe((data: any[]) => {
      this.toolslendData = data.map(item => {
        if (item.date && item.date.toDate) {
          item.date = item.date.toDate(); // Convertir la marca de tiempo a fecha de JavaScript
        }
        return item;
      });
    });
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async confirmDeleteLend(item: any) {
    const reasonAlert = await this.alertController.create({
      header: 'RETURN LEND',
      message: `Please provide a reason for returning the lend of ${item.ConsumableName}:`,
      inputs: [{ name: 'reason', type: 'text', placeholder: 'Reason' }],
      buttons: [
        { text: 'CANCEL', role: 'cancel' },
        {
          text: 'NEXT',
          handler: async (reasonData) => {
            const deleteAlert = await this.alertController.create({
              header: 'RETURN LEND',
              message: `Are you sure you want to return the lend of ${item.ConsumableName}?`,
              buttons: [
                { text: 'CANCEL', role: 'cancel' },
                {
                  text: 'RETURN',
                  handler: async () => {
                    try {
                      // Borrar el documento de la colección 'toolslend'
                      await this.firebaseService.deleteDocumentlend('toolslend', item.Id);

                      // Registrar la devolución en el historial
                      await this.firebaseService.setHistory('Histortools', {
                        user: this.userService.getUser(),
                        reason: reasonData.reason,
                        date: new Date(),
                        action: 'return lend',
                        consumable: item
                      });

                      // Recargar los datos de préstamo para reflejar los cambios
                      this.loadLendData(); 

                      // Actualizar el campo 'lend' en la colección 'consumables'
                      const lendQuantity = Number(item.Quantity);
                      const consumable = this.toolslendData.find(c => c.ConsumableName === item.ConsumableName);
                      if (consumable) {
                        consumable.lend -= lendQuantity;
                        consumable.SubTotal += lendQuantity;

                        await this.firebaseService.update(`consumables/${consumable.Id}`, {
                          lend: consumable.lend,
                          SubTotal: consumable.SubTotal
                        });
                      }
                    } catch (error) {
                      console.error('Error deleting lend or updating consumable fields:', error);
                    }
                  }
                }
              ]
            });

            await deleteAlert.present();
          }
        }
      ]
    });

    await reasonAlert.present();
  }
  
  loadLendData() {
    // Recargar los datos de préstamo desde Firebase (reemplaza con la lógica adecuada)
    this.firebaseService.getToolslendCollection().subscribe(data => {
      this.toolslendData = data;
      this.cdr.detectChanges();  // Refrescar la vista después de recargar los datos
    });
  }}