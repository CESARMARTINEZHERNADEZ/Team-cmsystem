import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.servicetest';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/User.Service'; 
import { LendModalComponent } from '../lend-modal/lend-modal.component';


@Component({
  selector: 'app-tools',
  templateUrl: './tools.page.html',
  styleUrls: ['./tools.page.scss', '../app.component.scss'],
})
export class ToolsPage implements OnInit {
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

  public c1lend: any[] = [];
  public showLend = false;


  constructor(
    private alertController: AlertController,
    private firebaseService: FirebaseService,
    private userService: UserService, 
    private router: Router,
    private route: ActivatedRoute,
    private modalController: ModalController,
  ) {
    this.consumables = [];
    this.selectedOption = 'option1';
    this.selectedHistoryOption = 'actionAsc';

    this.firebaseService.getCollection('Historytools').subscribe((historyData: any[]) => {
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

  async presentLendModal() {
    const modal = await this.modalController.create({
      component: LendModalComponent,
    });
    return await modal.present();
  }


  loadConsumables() {
    this.firebaseService.getCollection('consumables').subscribe((data: any[]) => {
      this.consumables = data.filter(c => c.location === this.location);
      this.sortConsumables();
    });
  }

  selectLocation(location: string) {
    console.log('Selected location:', location);
    this.router.navigate(['/tools'], { queryParams: { location } });
  }


  async getLocations(): Promise<any[]> {
    try {
      const snapshot = await this.firebaseService.firestore.collection('toolslocation').get().toPromise();
  
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
    const locations = await this.firebaseService.getLocationstools();
  
    const alert = await this.alertController.create({
      header: 'ADD CONSUMABLE',
      message: 'Enter the details of the new consumable',
      inputs: [
        { name: 'consumable', type: 'text', placeholder: 'Consumable' },
        { name: 'description', type: 'text', placeholder: 'Description' },
        { name: 'partNumber', type: 'text', placeholder: 'Part Number' },
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
                      SubTotal: +data.subtotal,
                      Comment: data.Comment,
                      location: locationData,
                      lend: 0,
                      damage: 0,
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
                            this.firebaseService.setHistory('Historytools', {
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
    const locations = await this.firebaseService.getLocationstools();
  
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
                { name: 'subtotal', type: 'number', placeholder: 'Available', value: consumable.SubTotal.toString() },
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
                              SubTotal: +data.subtotal,
                              Comment: data.Comment,
                              location: locationId,
                              
                            };
                            updatedConsumable.total = this.calculateTotal(updatedConsumable);
  
                            this.firebaseService.setHistory('Historytools', {
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
            await this.firebaseService.setHistory('Historytools', {
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
    return consumable.SubTotal + consumable.lend + consumable.damage;
  }


  async showActionAlert(consumable: any) {
   
    const alert = await this.alertController.create({
      header: `Actions for ${consumable.Consumable}`,
      inputs: [
        { name: 'quantity', type: 'number', placeholder: 'Quantity' },
        { name: 'reason', type: 'text', placeholder: 'Reason' }
      ],
      buttons: [
        {
          text: 'Add',
          handler: data => {
            this.updateConsumableQuantity(consumable, +data.quantity, 'increment', data.reason);
          }
        },
        {
          text: 'Used',
          handler: data => {
            this.updateConsumableQuantity(consumable, -data.quantity, 'lend', data.reason);
          }
        },
        {
          text: 'Damage',
          handler: data => {
            this.updateConsumableQuantity(consumable, -data.quantity, 'damage', data.reason);
          }
        },
        { text: 'Cancelar', role: 'cancel' }
      ]
    });
  
    await alert.present();
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
    
        // Guardar en la colección toolslend con la cantidad en positivo
        const newId = this.firebaseService.generateDocId('toolslend');
        this.firebaseService.addToCollection('toolslend', {
          Id: newId,
          Quantity: Math.abs(quantity),  // Asegurar que la cantidad sea positiva
          reason: reason,
          user: user,
          date: new Date(),
          consumableId: consumable.Id, // También puedes guardar el ID del consumible si lo necesitas
          ConsumableName: consumable.Consumable
        }).catch(error => {
          console.error('Error saving to toolslend:', error);
        });
        break;
      case 'damage':
        consumable.damage -= quantity;
        consumable.SubTotal += quantity;
        break;
    }
  
    // Recalcular el Total
    consumable.total = consumable.SubTotal + consumable.lend;
  
    // Guardar en la base de datos la actualización del consumible
    this.firebaseService.update(`consumables/${consumable.Id}`, consumable).then(() => {
      this.firebaseService.setHistory('Historytools', {
        user: user,
        reason: reason,
        date: new Date(),
        action: action,
        consumable: consumable
      });
      this.loadConsumables();  // Recargar los consumibles para reflejar los cambios
    }).catch(error => {
      console.error('Error updating consumable:', error);
    });
  }


  toggleLend() {
    this.showLend = !this.showLend;
    if (this.showLend) {
      this.loadLendData();
    }
  }

  loadLendData() {
    this.firebaseService.getCollectionlend('toolslend').subscribe((data: any[]) => {
      this.c1lend = data.map((item) => {
        const timestamp = item.date.seconds * 1000 + item.date.nanoseconds / 1000000;
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
  
        return {
          ...item,
          date: formattedDate,
          Quantity: Number(item.Quantity) // Asegurarse de que quantity sea un número
        };
      });
  
      
    });
  }

  async confirmDeleteLend(item: any) {
    const user = this.userService.getUser();
    const reasonAlert = await this.alertController.create({
      header: 'RETURN LEND',
      message: `Please provide a reason for returning the lend of ${item.ConsumableName}:`,
      inputs: [{ name: 'reason', type: 'text', placeholder: 'Reason' }],
      buttons: [
        { text: 'CANCEL', role: 'cancel' },
        {
          text: 'NEXT',
          handler: async (reasonData) => {
            // Confirm deletion
            const deleteAlert = await this.alertController.create({
              header: 'RETURN LEND',
              message: `Are you sure you want to return the lend of ${item.ConsumableName}?`,
              buttons: [
                { text: 'CANCEL', role: 'cancel' },
                {
                  text: 'RETURN',
                  handler: async () => {
                    try {
                      // Delete the document from the 'c1lend' collection
                      await this.firebaseService.deleteDocumentlend('toolslend', item.Id);
                   
                      // Log the deletion reason and user information in history
                      await this.firebaseService.setHistory('Histortools', {
                       
                        user: this.userService.getUser(),
                        reason: reasonData.reason,
                        date: new Date(),
                        action: 'return lend',
                        consumable: item
                      });
  
                      // Reload lend data to reflect changes
                      this.loadLendData();  // Refresh the lend data after deletion
  
                      // Update the 'lend' field in the 'consumables' collection
                      const lendQuantity = Number(item.Quantity)
                      const consumable = this.consumables.find(c => c.ConsumableName === item.consumable);
                      if (consumable) {
                        consumable.lend -= lendQuantity; // Subtract the lend quantity
                        consumable.SubTotal += lendQuantity; // Add the lend quantity back to SubTotal
  
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
}