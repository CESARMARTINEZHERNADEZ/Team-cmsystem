import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.servicetest';
import { Router } from '@angular/router';
import { UserService } from '../services/User.Service'; 

@Component({
  selector: 'app-cat6table',
  templateUrl: './cat6table.page.html',
  styleUrls: ['./cat6table.page.scss'],
})
export class Cat6tablePage implements OnInit {
  public consumables: any[] = [];
  public selectedOption: string = 'option1';
  public selectedHistoryOption: string = 'actionAsc';
  public selectedConsumables: any = {};
  public consumableQuantities: any = {};
  public scrap: any[] = [];
  public showScrap: boolean = false;
  public selectedConsumablesScrap: any[] = [];
  public History: any[] = [];
  public showTable = false;
  public showDB = false;
  public itemsPerPage = 20;
  public currentPage = 1;
  public paginatedHistory: any[] = [];
  public totalPages = 0;

  public lend: any[] = [];
  public showLend: boolean = false;
  public selectedConsumablesLend: any[] = [];

  constructor(
    private alertController: AlertController,
    private firebaseService: FirebaseService,
    private userService: UserService, 
    private router: Router
  ) {
    this.consumables = [];
    this.selectedOption = 'option1';
    this.selectedHistoryOption = 'actionAsc'; 
     

    this.firebaseService.getCollection('HistoryCat6').subscribe((historyData: any[]) => {
      
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
      this.router.navigate(['/login']);
    }
    else {
      this.loadConsumables();
      this.sortHistory();
      this.loadScrap();			 
    }
  }

  loadConsumables() {
    this.firebaseService.getCollection('Cat6').subscribe((data: any[]) => {
      this.consumables = data;
      this.sortConsumables();
    });
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
        case 'actionAsc':
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

  toggleScrap() {
    this.showScrap = !this.showScrap;
  }
 
  toggleLend() {
    this.showLend = !this.showLend;
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
    const alert = await this.alertController.create({
      header: 'ADD CONSUMABLE',
      message: 'Enter the details of the new consumable',
      inputs: [
        { name: 'consumable', type: 'text', placeholder: 'Consumable' },
        { name: 'description', type: 'text', placeholder: 'Description' },
        { name: 'partNumber', type: 'text', placeholder: 'Part Number' },
        { name: 'minimumLevel', type: 'number', placeholder: 'Minimum Level' },
        { name: 'maximumLevel', type: 'number', placeholder: 'Maximum Level' },
        { name: 'subtotal', type: 'number', placeholder: 'Total' },
   
      ],
      buttons: [
        { text: 'CANCEL', role: 'cancel' },
        {
          text: 'ADD',
          handler: async (data) => {
            const newId = this.firebaseService.firestore.createId();
            const newConsumable = {
              Id: newId,
              Consumable: data.consumable,
              Description: data.description,
              PartNumber: data.partNumber,
              MinimumLevel: +data.minimumLevel,
              MaximumLevel: +data.maximumLevel,
              SubTotal: +data.subtotal,
           
            };
            const actionAlert = await this.alertController.create({
              header: `Explain the reason for adding ${data.consumable}`,
              inputs: [{ name: 'reason', type: 'text', placeholder: 'Reason' }],
              buttons: [
                { text: 'CANCEL', role: 'cancel' },
                {
                  text: 'ACCEPT',
                  handler: async (reasonData) => {
                    this.firebaseService.setHistory('HistoryCat6', {
                      user: this.userService.getUser(), 
                      reason: reasonData.reason,
                      date: new Date(),
                      action: 'add',
                      consumable: newConsumable
                    });

                    this.firebaseService.setCollectionWithId('Cat6', newId, newConsumable)
                      .then(() => this.loadConsumables())
                      .catch((error) => console.error('Error adding consumable:', error));
                  }
                }
              ]
            });

            await actionAlert.present();
          }
        }
      ]
    });

    await alert.present();
  }

  async updateConsumable(consumable: any) {
    const user = this.userService.getUser();
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
                { name: 'subtotal', type: 'number', placeholder: 'Total', value: consumable.SubTotal.toString() },
              
              ],
              buttons: [
                { text: 'CANCEL', role: 'cancel' },
                {
                  text: 'SAVE',
                  handler: (data) => {
                    const updatedConsumable = {
                      ...consumable,
                      Consumable: data.consumable,
                      Description: data.description,
                      PartNumber: data.partNumber,
                      MinimumLevel: +data.minimumLevel,
                      MaximumLevel: +data.maximumLevel,
                      SubTotal: +data.subtotal,
                     
                    };

                    this.firebaseService.setHistory('HistoryCat6', {
                      user: this.userService.getUser(),
                      reason: reasonData.reason,
                      date: new Date(),
                      action: 'update',
                      consumable: updatedConsumable
                    });

                    this.firebaseService.update(`Cat6/${consumable.Id}`, updatedConsumable)
                      .then(() => this.loadConsumables())
                      .catch((error) => console.error('Error updating consumable:', error));
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
																			 
						   
            await this.firebaseService.setHistory('HistoryCat6', {
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
                    this.firebaseService.deleteDocument('Cat6', consumable.Id)
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
    this.router.navigate(['/login']);
  }


  //LEND
  updateSelectedConsumables(event: any, consumable: any) {
    if (event.detail.checked) {
      this.selectedConsumables[consumable.Id] = consumable;
    } else {
      delete this.selectedConsumables[consumable.Id];
    }
  }
  
  updateSelectedConsumablesLend(event: any, consumable: any) {
    if (event.detail.checked) {
      this.selectedConsumablesLend.push({
        ...consumable,
        quantity: 0,
        reason: ''
      });
    } else {
      this.selectedConsumablesLend = this.selectedConsumablesLend.filter(c => c.Id !== consumable.Id);
    }
    console.log(this.selectedConsumablesLend); 
  }
  
  updateConsumableQuantityLend(event: any, consumable: any) {
    const index = this.selectedConsumablesLend.findIndex(c => c.Id === consumable.Id);
    if (index !== -1) {
      this.selectedConsumablesLend[index].quantity = event.detail.value;
    }
    console.log(this.selectedConsumablesLend); 
  }
  
  updateConsumableReasonLend(event: any, consumable: any) {
    const index = this.selectedConsumablesLend.findIndex(c => c.Id === consumable.Id);
    if (index !== -1) {
      this.selectedConsumablesLend[index].reason = event.detail.value;
    }
    console.log(this.selectedConsumablesLend); 
  }
  
  updateLendTotal() {
    console.log("Updating Lend Total...");
    this.selectedConsumablesLend.forEach(selected => {
        const lendId = this.firebaseService.firestore.createId(); 
        const newLend = {
            Id: lendId, 
            Lend: selected.quantity,
            Consumable: selected.Consumable,
            Reason: selected.reason,
            Date: new Date()
        };
  
        this.firebaseService.setCollectionWithId('lendCat6', lendId, newLend)
            .then(() => {
                console.log(`Updated lend: ${newLend.Consumable}`);
                this.loadLend();
  
                // Registrar en History
                this.firebaseService.setHistory('HistoryCat6', {
                    user: this.userService.getUser(),
                    reason: selected.reason,
                    date: new Date(),
                    action: 'lend',
                    consumable: newLend
                });
            })
            .catch((error) => console.error('Error updating:', error));
    });
  }
  
  loadLend() {
    this.firebaseService.getCollection('lendCat6').subscribe((data: any[]) => {
      this.lend = data.map((item) => {
        let formattedDate = item.Date;
        if (item.Date && item.Date.seconds) {
          const timestamp = item.Date.seconds * 1000 + item.Date.nanoseconds / 1000000;
          const date = new Date(timestamp);
          formattedDate = date.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
        }
        
        return {
          ...item,
          Date: formattedDate,
        };
      });
      this.lend.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
    });
  }
  
  async updateLend(lend: any) {
    const user = this.userService.getUser();
    const reasonAlert = await this.alertController.create({
      header: 'UPDATE LEND',
      message: 'Please provide a reason for the update:',
      inputs: [{ name: 'reason', type: 'text', placeholder: 'Reason' }],
      buttons: [
        { text: 'CANCEL', role: 'cancel' },
        {
          text: 'NEXT',
          handler: async (reasonData) => {
            const updateAlert = await this.alertController.create({
              header: 'UPDATE LEND',
              message: 'New details of the lend',
              inputs: [
                { name: 'quantity', type: 'number', placeholder: 'Quantity', value: lend.Lend.toString() },
                { name: 'reason', type: 'text', placeholder: 'Reason', value: lend.Reason },
              ],
              buttons: [
                { text: 'CANCEL', role: 'cancel' },
                {
                  text: 'SAVE',
                  handler: (data) => {
                    const updatedLend = {
                      ...lend,
                      Lend: +data.quantity,
                      Reason: data.reason,
                      Date: new Date()
                    };
  
                    this.firebaseService.setHistory('HistoryCat6', {
                      user: this.userService.getUser(),
                      reason: reasonData.reason,
                      date: new Date(),
                      action: 'update lend',
                      lend: updatedLend,
                      consumable: lend
                    });
  
                    this.firebaseService.update(`lendCat6/${lend.Id}`, updatedLend)
                      .then(() => this.loadLend())
                      .catch((error) => console.error('Error updating lend:', error));
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
  
  async deleteLend(lend: any) {
    const user = this.userService.getUser();
    const reasonAlert = await this.alertController.create({
        header: 'DELETE LEND',
        message: `Please provide a reason for deleting ${lend.Consumable}:`,
        inputs: [{ name: 'reason', type: 'text', placeholder: 'Reason' }],
        buttons: [
            { text: 'CANCEL', role: 'cancel' },
            {
                text: 'NEXT',
                handler: async (reasonData) => {
                    await this.firebaseService.setHistory('HistoryCat6', {
                        user: this.userService.getUser(),
                        reason: reasonData.reason,
                        date: new Date(),
                        action: 'delete lend',
                        consumable: lend
                    });
  
                    const deleteAlert = await this.alertController.create({
                        header: 'DELETE LEND',
                        message: `Are you sure you want to delete ${lend.Consumable}?`,
                        buttons: [
                            { text: 'CANCEL', role: 'cancel' },
                            {
                                text: 'DELETE',
                                handler: () => {
                                    this.firebaseService.deleteDocument('lendCat6', lend.Id)
                                        .then(() => {
                                            this.loadLend();
  
                                            // Registrar en History
                                            this.firebaseService.setHistory('HistoryCat6', {
                                                user: this.userService.getUser(),
                                                reason: reasonData.reason,
                                                date: new Date(),
                                                action: 'delete lend',
                                                consumable: lend
                                            });
                                        })
                                        .catch((error) => console.error('Error deleting lend:', error));
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

//SCRAP
  updateSelectedConsumablesScrap(event: any, consumable: any) {
    if (event.detail.checked) {
      this.selectedConsumablesScrap.push({
        ...consumable,
        quantity: 0,
        reason: ''
      });
    } else {
      this.selectedConsumablesScrap = this.selectedConsumablesScrap.filter(c => c.Id !== consumable.Id);
    }
    console.log(this.selectedConsumablesScrap); 
  }
  
  updateConsumableQuantityScrap(event: any, consumable: any) {
    const index = this.selectedConsumablesScrap.findIndex(c => c.Id === consumable.Id);
    if (index !== -1) {
      this.selectedConsumablesScrap[index].quantity = event.detail.value;
    }
    console.log(this.selectedConsumablesScrap); 
  }
  
  updateConsumableReason(event: any, consumable: any) {
    const index = this.selectedConsumablesScrap.findIndex(c => c.Id === consumable.Id);
    if (index !== -1) {
      this.selectedConsumablesScrap[index].reason = event.detail.value;
    }
    console.log(this.selectedConsumablesScrap); 
  }
  
  updateScrapTotal() {
    console.log("Updating Scrap Total...");
    this.selectedConsumablesScrap.forEach(selected => {
        const scrapId = this.firebaseService.firestore.createId();
        const newScrap = {
            Id: scrapId, 
            Scrap: selected.quantity,
            Consumable: selected.Consumable,
            Reason: selected.reason,
            Date: new Date()
        };

        this.firebaseService.setCollectionWithId('scrapCat6', scrapId, newScrap) 
            .then(() => {
                console.log(`Updated scrap: ${newScrap.Consumable}`);
                this.loadScrap();

                // Registrar en History
                this.firebaseService.setHistory('HistoryCat6', {
                    user: this.userService.getUser(),
                    reason: selected.reason,
                    date: new Date(),
                    action: 'scrap',
                    consumable: newScrap
                });
            })
            .catch((error) => console.error('Error updating:', error));
    });
}
async updateScrap(scrap: any) {
  const user = this.userService.getUser();
  const reasonAlert = await this.alertController.create({
    header: 'UPDATE SCRAP',
    message: 'Please provide a reason for the update:',
    inputs: [{ name: 'reason', type: 'text', placeholder: 'Reason' }],
    buttons: [
      { text: 'CANCEL', role: 'cancel' },
      {
        text: 'NEXT',
        handler: async (reasonData) => {
          const updateAlert = await this.alertController.create({
            header: 'UPDATE SCRAP',
            message: 'New details of the scrap',
            inputs: [
              { name: 'quantity', type: 'number', placeholder: 'Quantity', value: scrap.Scrap.toString() },
              { name: 'reason', type: 'text', placeholder: 'Reason', value: scrap.Reason },
            ],
            buttons: [
              { text: 'CANCEL', role: 'cancel' },
              {
                text: 'SAVE',
                handler: (data) => {
                  const updatedScrap = {
                    ...scrap,
                    Scrap: +data.quantity,
                    Reason: data.reason,
                    Date: new Date()
                  };

                  this.firebaseService.setHistory('HistoryCat6', {
                    user: this.userService.getUser(),
                    reason: reasonData.reason,
                    date: new Date(),
                    action: 'update scrap',
                    scrap: updatedScrap,
                    consumable: scrap
                  });

                  this.firebaseService.update(`scrapCat6/${scrap.Id}`, updatedScrap)
                    .then(() => this.loadScrap())
                    .catch((error) => console.error('Error updating scrap:', error));
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

  loadScrap() {
    this.firebaseService.getCollection('scrapCat6').subscribe((data: any[]) => {
      this.scrap = data.map((item) => {
        let formattedDate = item.Date;
        if (item.Date && item.Date.seconds) {
          const timestamp = item.Date.seconds * 1000 + item.Date.nanoseconds / 1000000;
          const date = new Date(timestamp);
          formattedDate = date.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
        }
        
        return {
          ...item,
          Date: formattedDate,
        };
      });
      this.scrap.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
    });
  }
  
  
  async deleteScrap(scrap: any) {
    const user = this.userService.getUser();
    const reasonAlert = await this.alertController.create({
        header: 'DELETE SCRAP',
        message: `Please provide a reason for deleting ${scrap.Consumable}:`,
        inputs: [{ name: 'reason', type: 'text', placeholder: 'Reason' }],
        buttons: [
            { text: 'CANCEL', role: 'cancel' },
            {
                text: 'NEXT',
                handler: async (reasonData) => {
                    await this.firebaseService.setHistory('HistoryCat6', {
                        user: this.userService.getUser(),
                        reason: reasonData.reason,
                        date: new Date(),
                        action: 'delete scrap',
                        consumable: scrap
                    });
  
                    const deleteAlert = await this.alertController.create({
                        header: 'DELETE SCRAP',
                        message: `Are you sure you want to delete ${scrap.Consumable}?`,
                        buttons: [
                            { text: 'CANCEL', role: 'cancel' },
                            {
                                text: 'DELETE',
                                handler: () => {
                                    this.firebaseService.deleteDocument('scrapCat6', scrap.Id)
                                        .then(() => {
                                            this.loadScrap();
  
                                            // Registrar en HistoryC1
                                            this.firebaseService.setHistory('HistoryCat6', {
                                                user: this.userService.getUser(),
                                                reason: reasonData.reason,
                                                date: new Date(),
                                                action: 'delete scrap',
                                                consumable: scrap
                                            });
                                        })
                                        .catch((error) => console.error('Error deleting scrap:', error));
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
