import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.servicetest';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/User.Service'; 
import { AngularFirestoreCollection, AngularFirestoreDocument, Query } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { SerialNumberModalComponent } from '../serial-number-modal/serial-number-modal.component'; // Adjust the path accordingly
import { SerialNumberlendModalComponent } from '../serial-numberlend-modal/serial-numberlend-modal.component';

@Component({
  selector: 'app-c1table',
  templateUrl: './c1table.page.html',
  styleUrls: ['./c1table.page.scss','../app.component.scss'],
})
export class C1tablePage implements OnInit {
  public consumables: any[] = [];
  public selectedOption: string = 'option1';
  public selectedHistoryOption: string = 'actionAsc';
  public selectedConsumables: any = {};
  public consumableQuantities: any = {};
  public History: any[] = [];
  public showTable = false;
  public showDB = false;
  public itemsPerPage = 20;
  public currentPage = 1;
  public paginatedHistory: any[] = [];
  public totalPages = 0;
  location: string = '';

  constructor(
    private alertController: AlertController,
    private firebaseService: FirebaseService,
    private userService: UserService, 
    private router: Router,
    private route: ActivatedRoute,
    private modalController: ModalController // Inject ModalController here
  ) {
    this.consumables = [];
    this.selectedOption = 'option1';
    this.selectedHistoryOption = 'actionAsc';

    this.firebaseService.getCollection('HistoryC1').subscribe((historyData: any[]) => {
      this.History = historyData.map((item) => {
        const timestamp = item.date.seconds * 1000 + item.date.nanoseconds / 1000000;
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });

        return {
          ...item,
          date: formattedDate,
        };
      });
      this.totalPages = Math.ceil(this.History.length / this.itemsPerPage);
      this.sortHistory();
      this.updatePagination();
    });
  }

  ngOnInit() {
    const user = this.userService.getUser();
    if (!user) {
      this.router.navigate(['/dashboard']);
    } else {
      this.route.queryParams.subscribe(params => {
        this.location = params['location'];
        this.loadConsumables();
        this.sortHistory();
      });
     
    }
  }
 
  async handleSubTotalClick(consumable: any) {
    try {
      // Get all documents from the collection where consumableName matches the selected consumable name
      const lendSnSnapshot = await this.firebaseService.getCollectionWhere('Numparts', 'consumableName', '==', consumable.Consumable);
  
      if (lendSnSnapshot.empty) {
        // Show an alert if no serial numbers are found
        const alert = await this.alertController.create({
          header: 'No Serial Numbers Found',
          message: `No serial numbers found for ${consumable.Consumable}`,
          buttons: ['OK']
        });
        await alert.present();
      } else {
        // Collect the serial numbers from the documents found
        const serialNumbers: string[] = [];
  
        lendSnSnapshot.forEach(doc => {
          serialNumbers.push(doc.data()['serialNumber']);
        });
  
        // Present the serial numbers in a modal
        const modal = await this.modalController.create({
          component: SerialNumberModalComponent,
          componentProps: {
            consumableName: consumable.Consumable,
            serialNumbers: serialNumbers // Ensure this is correct
          }
        });
  
        await modal.present();
      }
    } catch (error) {
      console.error('Error fetching serial numbers:', error);
    }
  }
  
  async handlelendClick(consumable: any) {
    try {
      // Obtener todos los documentos de la colección lendSn donde el consumableName sea igual al nombre del consumable seleccionado
      const lendSnSnapshot = await this.firebaseService.getCollectionWhere('lendSn', 'consumableName', '==', consumable.Consumable);
  
      if (lendSnSnapshot.empty) {
        // Si no hay resultados, mostrar un mensaje de alerta
        const alert = await this.alertController.create({
          header: 'No Serial Numbers Found',
          message: `No serial numbers found for ${consumable.Consumable}`,
          buttons: ['OK']
        });
        await alert.present();
      } else {
        // Recopilar los serial numbers de los documentos encontrados
        const serialNumbers: string[] = [];
        const reason: string[] = [];

        lendSnSnapshot.forEach(doc => {
          serialNumbers.push(doc.data()['serialNumber']);
          reason.push(doc.data()['reason']);

        });
  
       // Present the serial numbers in a modal
       const modal = await this.modalController.create({
        component: SerialNumberlendModalComponent,
        componentProps: {
          consumableName: consumable.Consumable,
          serialNumbers: serialNumbers, // Ensure this is correct
          reason: reason,
        }
      });

      await modal.present();
    }
  } catch (error) {
    console.error('Error fetching serial numbers:', error);
  }
}









  loadConsumables() {
    this.firebaseService.getCollection('consumables').subscribe((data: any[]) => {
      this.consumables = data.filter(c => c.location === this.location);
      this.sortConsumables();
    });
  }

  selectLocation(location: string) {
    console.log('Selected location:', location);
    this.router.navigate(['/c1table'], { queryParams: { location } });
  }


  async getLocations(): Promise<any[]> {
    try {
      const snapshot = await this.firebaseService.firestore.collection('locations').get().toPromise();
  
      if (snapshot && !snapshot.empty) {
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching locations: ", error);
      return [];
    }
  }
  
  sortConsumables() {
    switch (this.selectedOption) {
      case 'option1':
        this.consumables.sort((a, b) => a.Consumable.localeCompare(b.Consumable));
        break;
      case 'option2':
        this.consumables.sort((a, b) => b.Consumable.localeCompare(a.Consumable));
        break;
      case 'option3':
        this.consumables.sort((a, b) => b.SubTotal - a.SubTotal);
        break;
      case 'option4':
        this.consumables.sort((a, b) => a.SubTotal - b.SubTotal);
        break;
    }
  }

  onOptionChange(event: any) {
    this.selectedOption = event.detail.value;
    this.sortConsumables();
  }

  sortHistory() {
    switch (this.selectedHistoryOption) {
      case 'nameAsc':
        this.History.sort((a, b) => a.consumable.Consumable.localeCompare(b.consumable.Consumable));
        break;
      case 'nameDesc':
        this.History.sort((a, b) => b.consumable.Consumable.localeCompare(a.consumable.Consumable));
        break;
      case 'actionAsc':
        this.History.sort((a, b) => a.action.localeCompare(b.action));
        break;
      case 'userAsc':
        this.History.sort((a, b) => a.user.fullName.localeCompare(b.user.fullName));
        break;
      default:
        this.History.sort((a, b) => a.action.localeCompare(b.action));
        break;
    }
    this.updatePagination();
  }

  onHistoryOptionChange(event: any) {
    this.selectedHistoryOption = event.detail.value;
    this.sortHistory();
  }

  toggleTable() {
    this.showTable = !this.showTable;
  }

  toggleDB() {
    this.showDB = !this.showDB;
  }


  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedHistory = this.History.slice(startIndex, startIndex + this.itemsPerPage);
  }

  async addConsumable() {
    const user = this.userService.getUser();
    const locations = await this.firebaseService.getLocations();
  
    const alert = await this.alertController.create({
      header: 'ADD CONSUMABLE',
      message: 'Enter the details of the new consumable',
      inputs: [
        { name: 'consumable', type: 'text', placeholder: 'Consumable' },
        { name: 'description', type: 'text', placeholder: 'Description' },
        { name: 'partNumber', type: 'text', placeholder: 'Part Number' },
        { name: 'minimumLevel', type: 'number', placeholder: 'Minimum Level' },
        { name: 'maximumLevel', type: 'number', placeholder: 'Maximum Level' },
        { name: 'subtotal', type: 'number', placeholder: 'Available' },
        { name: 'Comment', type: 'text', placeholder: 'Comment' },
        
      ],
      buttons: [
        { text: 'CANCEL', role: 'cancel' },
        {
          text: 'NEXT',
          handler: async (data) => {
            const locationAlert = await this.alertController.create({
              header: 'Select Location',
              inputs: locations.map(location => ({
                name: 'location',
                type: 'radio',
                label: location.location,
                value: location.location,
              })),
              buttons: [
                { text: 'CANCEL', role: 'cancel' },
                {
                  text: 'ADD',
                  handler: async (locationData) => {
                    const newId = this.firebaseService.generateDocId('consumables');
                    const newConsumable = {
                      Id: newId,
                      Consumable: data.consumable,
                      Description: data.description,
                      PartNumber: data.partNumber,
                      MinimumLevel: +data.minimumLevel,
                      MaximumLevel: +data.maximumLevel,
                      SubTotal: +data.subtotal,
                      Comment: data.Comment,
                      location: locationData,
                      lend: 0,
                      damage: 0,
                      life: 0,
                      total: +data.subtotal,
                    };
  
                    const actionAlert = await this.alertController.create({
                      header: `Explain the reason for adding ${data.consumable}`,
                      inputs: [{ name: 'reason', type: 'text', placeholder: 'Reason' }],
                      buttons: [
                        { text: 'CANCEL', role: 'cancel' },
                        {
                          text: 'ACCEPT',
                          handler: async (reasonData) => {
                            this.firebaseService.setHistory('HistoryC1', {
                              user: user,
                              reason: reasonData.reason,
                              date: new Date(),
                              action: 'add',
                              consumable: newConsumable,
                            });
  
                            this.firebaseService
                              .setCollectionWithId('consumables', newId, newConsumable)
                              .then(() => this.loadConsumables())
                              .catch((error) => console.error('Error adding consumable:', error));
                          },
                        },
                      ],
                    });
  
                    await actionAlert.present();
                  },
                },
              ],
            });
  
            await locationAlert.present();
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  async updateConsumable(consumable: any) {
    const user = this.userService.getUser();
    const locations = await this.firebaseService.getLocations();
  
    const reasonAlert = await this.alertController.create({
      header: 'UPDATE CONSUMABLE',
      message: 'Please provide a reason for the update:',
      inputs: [{ name: 'reason', type: 'text', placeholder: 'Reason' }],
      buttons: [
        { text: 'CANCEL', role: 'cancel' },
        {
          text: 'NEXT',
          handler: async (reasonData) => {
            const updateAlert = await this.alertController.create({
              header: 'UPDATE CONSUMABLE',
              message: 'New details of the consumable',
              inputs: [
                { name: 'consumable', type: 'text', placeholder: 'Consumable', value: consumable.Consumable },
                { name: 'description', type: 'text', placeholder: 'Description', value: consumable.Description },
                { name: 'partNumber', type: 'text', placeholder: 'Part Number', value: consumable.PartNumber },
                { name: 'minimumLevel', type: 'number', placeholder: 'Minimum Level', value: consumable.MinimumLevel.toString() },
                { name: 'maximumLevel', type: 'number', placeholder: 'Maximum Level', value: consumable.MaximumLevel.toString() },
                { name: 'Comment', type: 'text', placeholder: 'Comment', value: consumable.Comment },
            


             
              ],
              buttons: [
                { text: 'CANCEL', role: 'cancel' },
                {
                  text: 'NEXT',
                  handler: async (data) => {
                    const locationAlert = await this.alertController.create({
                      header: 'Select Location',
                      inputs: locations.map(location => ({
                        name: 'location',
                        type: 'radio',
                        label: location.location,
                        value: location.location,
                      })),
                      buttons: [
                        { text: 'CANCEL', role: 'cancel' },
                        {
                          text: 'SAVE',
                          handler: async (locationId) => {
                            const updatedConsumable = {
                              ...consumable,
                              Consumable: data.consumable,
                              Description: data.description,
                              PartNumber: data.partNumber,
                              MinimumLevel: +data.minimumLevel,
                              MaximumLevel: +data.maximumLevel,
                              SubTotal: +data.subtotal,
                              Comment: data.Comment,
                              location: locationId,
                              
                            };
                            updatedConsumable.total = this.calculateTotal(updatedConsumable);
  
                            this.firebaseService.setHistory('HistoryC1', {
                              user: user,
                              reason: reasonData.reason,
                              date: new Date(),
                              action: 'update',
                              consumable: updatedConsumable
                            });
  
                            this.firebaseService.update(`consumables/${consumable.Id}`, updatedConsumable)
                              .then(() => this.loadConsumables())
                              .catch((error) => console.error('Error updating consumable:', error));
                          }
                        }
                      ]
                    });
  
                    await locationAlert.present();
                  }
                }
              ]
            });
  
            await updateAlert.present();
          }
        }
      ]
    });
  
    await reasonAlert.present();
  }
  
  

  async deleteConsumable(consumable: any) {
    const user = this.userService.getUser();
    const reasonAlert = await this.alertController.create({
      header: 'DELETE CONSUMABLE',
      message: `Please provide a reason for deleting ${consumable.Consumable}:`,
      inputs: [{ name: 'reason', type: 'text', placeholder: 'Reason' }],
      buttons: [
        { text: 'CANCEL', role: 'cancel' },
        {
          text: 'NEXT',
          handler: async (reasonData) => {
            await this.firebaseService.setHistory('HistoryC1', {
              user: this.userService.getUser(),
              reason: reasonData.reason,
              date: new Date(),
              action: 'delete',
              consumable: consumable
            });

            const deleteAlert = await this.alertController.create({
              header: 'DELETE CONSUMABLE',
              message: `Are you sure you want to delete ${consumable.Consumable}?`,
              buttons: [
                { text: 'CANCEL', role: 'cancel' },
                {
                  text: 'DELETE',
                  handler: () => {
                    this.firebaseService.deleteDocument('consumables', consumable.Id)
                      .then(() => this.loadConsumables())
                      .catch((error) => console.error('Error deleting consumable:', error));
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

  logout() {
    this.userService.clearUser();
    this.router.navigate(['/dashboard']);
  }



  calculateTotal(consumable: any) {
    consumable.total = consumable.SubTotal + consumable.lend; // Asegurarse de que siempre se calcule con SubTotal y lend
    return consumable.total;
}

 
  async showActionAlert(consumable: any) {
    const alert = await this.alertController.create({
        header: `Actions for ${consumable.Consumable}`,
        buttons: [
            {
                text: 'Add',
                cssClass: 'custom-alert-button',
                handler: async () => {
                    const scanAlert = await this.alertController.create({
                        header: 'Scan or Enter SN',
                        inputs: [
                            { name: 'serialNumber', type: 'text', placeholder: 'Scan/Enter SN' }
                        ],
                        buttons: [
                            {
                                text: 'Accept',
                                handler: data => {
                                    this.handleAddAction(consumable, data.serialNumber);
                                }
                            },
                            {
                                text: 'Cancel',
                                role: 'cancel',
                                cssClass: 'custom-alert-cancel'
                            }
                        ]
                    });
                    await scanAlert.present();
                }
            },
            {
                text: 'Lend',
                handler: async () => {
                    const lendAlert = await this.alertController.create({
                        header: 'Enter SN and Reason',
                        inputs: [
                            { name: 'serialNumber', type: 'text', placeholder: 'Enter SN' },
                            { name: 'reason', type: 'text', placeholder: 'Enter Reason' }
                        ],
                        buttons: [
                            {
                                text: 'Enter',
                                handler: data => {
                                    this.handleLendAction(consumable, data.serialNumber, data.reason);
                                }
                            },
                            {
                                text: 'Cancel',
                                role: 'cancel',
                                cssClass: 'custom-alert-cancel'
                            }
                        ]
                    });
                    await lendAlert.present();
                }
            },
            {
                text: 'Replace',
                handler: async () => {
                    const replaceAlert = await this.alertController.create({
                        header: 'Enter SN and Choose Action',
                        inputs: [
                            { name: 'serialNumber', type: 'text', placeholder: 'Enter SN' }
                        ],
                        buttons: [
                            {
                                text: 'Damage',
                                handler: data => {
                                    this.handleReplaceAction(consumable, data.serialNumber, 'damage');
                                }
                            },
                            {
                                text: 'End of Life',
                                handler: data => {
                                    this.handleReplaceAction(consumable, data.serialNumber, 'life');
                                }
                            },
                            {
                                text: 'Cancel',
                                role: 'cancel',
                                cssClass: 'custom-alert-cancel'
                            }
                        ]
                    });
                    await replaceAlert.present();
                }
            },
            {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'custom-alert-cancel'
            }
        ]
    });

    await alert.present();
}

handleAddAction(consumable: any, serialNumber: string) {
  const user = this.userService.getUser();

  this.firebaseService.getCollectionWhere('Numparts', 'serialNumber', '==', serialNumber)
    .then(async snapshot => {
      if (!snapshot.empty) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'The serial number already exists.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }

      // Si no existe, agregarlo
      consumable.SubTotal += 1;
      this.calculateTotal(consumable);

      this.firebaseService.update(`consumables/${consumable.Id}`, consumable)
        .then(() => {
          const newId = this.firebaseService.generateDocId('Numparts');

          const numpart = {
            id: newId,
            serialNumber: serialNumber,
            quantity: 1,
            consumableId: consumable.Id,
            consumableName: consumable.Consumable,
            date: new Date(),
            user: user
          };

          this.firebaseService.addToCollection('Numparts', numpart);

          this.firebaseService.setHistory('HistoryC1', {
            user: user,
            action: 'add SN',
            date: new Date(),
            consumable: consumable,
            details: `SN: ${serialNumber}, Quantity: 1`
          });

          this.loadConsumables();
        })
        .catch(error => {
          console.error('Error updating consumable:', error);
        });
    });
}
handleLendAction(consumable: any, serialNumber: string, reason: string) {
  const user = this.userService.getUser();

  this.firebaseService.getCollectionWhere('lendSn', 'serialNumber', '==', serialNumber)
    .then(async snapshot => {
      if (!snapshot.empty) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'The serial number already exists.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }

      // Si no existe, continuar con la operación
      consumable.SubTotal -= 1;
      consumable.lend += 1;
      this.calculateTotal(consumable);

      this.firebaseService.update(`consumables/${consumable.Id}`, consumable)
        .then(async () => {
          const newId = this.firebaseService.generateDocId('lendSn');

          const lendSn = {
            id: newId,
            serialNumber: serialNumber,
            quantity: 1,
            consumableId: consumable.Id,
            consumableName: consumable.Consumable,
            date: new Date(),
            reason: reason,
            user: user
          };

          await this.firebaseService.addToCollection('lendSn', lendSn);

          const numpartSnapshot = await this.firebaseService.getCollectionWhere('Numparts', 'serialNumber', '==', serialNumber);

          if (!numpartSnapshot.empty) {
            numpartSnapshot.forEach(async doc => {
              await this.firebaseService.deleteFromCollection('Numparts', doc.id);
            });
          }

          await this.firebaseService.setHistory('HistoryC1', {
            user: user,
            action: 'lend',
            date: new Date(),
            consumable: consumable,
            reason: reason,
            details: `SN: ${serialNumber}, Reason: ${reason}, Quantity: 1`
          });

          this.loadConsumables();
        })
        .catch(error => {
          console.error('Error updating consumable:', error);
        });
    });
}
async handleReplaceAction(consumable: any, serialNumber: string, action: string) {
  const user = this.userService.getUser();

  try {
    // Verificar si el serialNumber ya existe en la colección ReplaceActions
    const replaceSnapshot = await this.firebaseService.getCollectionWhere('ReplaceActions', 'serialNumber', '==', serialNumber);

    if (!replaceSnapshot.empty) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'The serial number already exists.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Verificar si el serialNumber existe en la colección lendSn
    const lendSnSnapshot = await this.firebaseService.getCollectionWhere('lendSn', 'serialNumber', '==', serialNumber);

    if (!lendSnSnapshot.empty) {
      lendSnSnapshot.forEach(async doc => {
        await this.firebaseService.deleteFromCollection('lendSn', doc.id);
      });

      if (consumable.lend > 0) {
        consumable.lend -= 1;
      } else {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'The value of lend cannot be reduced further, it is already 0.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }

      if (action === 'damage') {
        consumable.damage += 1;
      } else if (action === 'life') {
        consumable.life += 1;
      }

      this.calculateTotal(consumable);

      await this.firebaseService.update(`consumables/${consumable.Id}`, consumable);

      const newId = this.firebaseService.generateDocId('ReplaceActions');
      const replaceAction = {
        id: newId,
        serialNumber: serialNumber,
        quantity: 1,
        consumableId: consumable.Id,
        consumableName: consumable.Consumable,
        date: new Date(),
        action: action,
        user: user
      };

      await this.firebaseService.addToCollection('ReplaceActions', replaceAction);

      await this.firebaseService.setHistory('HistoryC1', {
        user: user,
        action: action,
        date: new Date(),
        consumable: consumable,
        details: `SN: ${serialNumber}, Action: ${action}, Quantity: 1`
      });

      this.loadConsumables();
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'The data does not correspond. Serial number was not found in the collection.',
        buttons: ['OK']
      });
      await alert.present();
    }
  } catch (error) {
    console.error('Error al manejar la acción de reemplazo:', error);
  }
}
updateConsumableQuantity(consumable: any, quantity: number, action: string, reason: string) {
  const user = this.userService.getUser();

  switch (action) {
      case 'increment':
          consumable.SubTotal += quantity;
          break;
      case 'lend':
          consumable.lend -= quantity;
          consumable.SubTotal += quantity;
          break;
      case 'damage':
          consumable.damage -= quantity;
          consumable.lend += quantity;
          break;
      case 'life':
          consumable.life -= quantity;
          consumable.lend += quantity;
          break;
  }

  // Recalcular el Total
  this.calculateTotal(consumable);

  this.firebaseService.update(`consumables/${consumable.Id}`, consumable).then(() => {
      this.firebaseService.setHistory('HistoryC1', {
          user: user,
          reason: reason,
          date: new Date(),
          action: action,
          consumable: consumable
      });
      this.loadConsumables();
  }).catch(error => {
      console.error('Error updating consumable:', error);
  });
}}