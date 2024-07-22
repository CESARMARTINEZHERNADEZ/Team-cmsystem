import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.servicetest';
import { Router } from '@angular/router';
import { UserService } from '../services/User.Service';

@Component({
  selector: 'app-life',
  templateUrl: './life.page.html',
  styleUrls: ['./life.page.scss'],
})
export class LifePage implements OnInit {
  public lifeConsumables: any[] = [];
  public showTable = false;
  public itemsPerPage = 20;
  public currentPage = 1;
  public paginatedLifeConsumables: any[] = [];
  public totalPages = 0;

  constructor(
    private alertController: AlertController,
    private firebaseService: FirebaseService,
    private userService: UserService,
    private router: Router
  ) {}


  ngOnInit() {
    const user = this.userService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
    } else {
      this.loadLifeConsumables();
     
    }
  }

  loadLifeConsumables() {
    this.firebaseService.getCollection('life').subscribe((data: any[]) => {
      this.lifeConsumables = data.map(item => {
        const initialDate = item.initialDate 
          ? new Date(item.initialDate.seconds * 1000 + item.initialDate.nanoseconds / 1000000)
          : null;
        const finalDate = item.finalDate 
          ? new Date(item.finalDate.seconds * 1000 + item.finalDate.nanoseconds / 1000000)
          : null;
        return {
          ...item,
          initialDate,
          finalDate,
          progress: initialDate && finalDate ? this.calculateProgress(initialDate, finalDate) : 0
        };
      });
      this.totalPages = Math.ceil(this.lifeConsumables.length / this.itemsPerPage);
      this.updatePagination();
    });
  }

  
  calculateProgress(initialDate: Date, finalDate: Date): number {
    const now = new Date().getTime();
    const start = initialDate.getTime();
    const end = finalDate.getTime();
    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  getProgressBarColor(progress: number): string {
    if (progress <= 40) return 'green';
    if (progress <= 80) return 'yellow';
    return 'red';
  }

  toggleTable() {
    this.showTable = !this.showTable;
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
    this.paginatedLifeConsumables = this.lifeConsumables.slice(startIndex, startIndex + this.itemsPerPage);
  }

  sortLifeConsumables(event: any) {
    const sortBy = event.detail.value;
    switch (sortBy) {
      case 'consumable-asc':
        this.lifeConsumables.sort((a, b) => a.Consumable.localeCompare(b.Consumable));
        break;
      case 'consumable-desc':
        this.lifeConsumables.sort((a, b) => b.Consumable.localeCompare(a.Consumable));
        break;
      case 'initialDate-asc':
        this.lifeConsumables.sort((a, b) => a.initialDate - b.initialDate);
        break;
      case 'initialDate-desc':
        this.lifeConsumables.sort((a, b) => b.initialDate - a.initialDate);
        break;
      case 'progress-green':
        this.lifeConsumables.sort((a, b) => this.getProgressBarColor(a.progress) === 'green' ? -1 : 1);
        break;
      case 'progress-yellow':
        this.lifeConsumables.sort((a, b) => this.getProgressBarColor(a.progress) === 'yellow' ? -1 : 1);
        break;
      case 'progress-red':
        this.lifeConsumables.sort((a, b) => this.getProgressBarColor(a.progress) === 'red' ? -1 : 1);
        break;
    }
    this.updatePagination();
  }

  async addLifeConsumable() {
    const alert = await this.alertController.create({
      header: 'ADD LIFE CONSUMABLE',
      message: 'Enter the details of the new life consumable',
      inputs: [
        { name: 'consumable', type: 'text', placeholder: 'Consumable' },
        { name: 'description', type: 'text', placeholder: 'Description' },
        { name: 'total', type: 'number', placeholder: 'Total' },
        { name: 'initialDate', type: 'date', placeholder: 'Initial Date' },
        { name: 'finalDate', type: 'date', placeholder: 'Final Date' }
      ],
      buttons: [
        { text: 'CANCEL', role: 'cancel' },
        {
          text: 'ADD',
          handler: async (data) => {
            const initialDate = new Date(data.initialDate);
            const finalDate = new Date(data.finalDate);
            if (isNaN(initialDate.getTime()) || isNaN(finalDate.getTime())) {
              console.error('Invalid dates provided');
              return;
            }
            const newId = this.firebaseService.firestore.createId();
            const newLifeConsumable = {
              Id: newId,
              Consumable: data.consumable,
              Description: data.description,
              Total: +data.total,
              initialDate,
              finalDate
            };

            this.firebaseService.setCollectionWithId('life', newId, newLifeConsumable)
              .then(() => this.loadLifeConsumables())
              .catch((error) => console.error('Error adding life consumable:', error));
          }
        }
      ]
    });

    await alert.present();
  }

  async updateLifeConsumable(lifeConsumable: any) {
    const reasonAlert = await this.alertController.create({
      header: 'UPDATE LIFE CONSUMABLE',
      message: 'New details of the life consumable',
      inputs: [
        { name: 'consumable', type: 'text', placeholder: 'Consumable', value: lifeConsumable.Consumable },
        { name: 'description', type: 'text', placeholder: 'Description', value: lifeConsumable.Description },
        { name: 'total', type: 'number', placeholder: 'Total', value: lifeConsumable.Total.toString() },
        { name: 'initialDate', type: 'date', placeholder: 'Initial Date', value: lifeConsumable.initialDate ? lifeConsumable.initialDate.toISOString().substring(0, 10) : '' },
        { name: 'finalDate', type: 'date', placeholder: 'Final Date', value: lifeConsumable.finalDate ? lifeConsumable.finalDate.toISOString().substring(0, 10) : '' }
      ],
      buttons: [
        { text: 'CANCEL', role: 'cancel' },
        {
          text: 'SAVE',
          handler: (data) => {
            const initialDate = new Date(data.initialDate);
            const finalDate = new Date(data.finalDate);
            if (isNaN(initialDate.getTime()) || isNaN(finalDate.getTime())) {
              console.error('Invalid dates provided');
              return;
            }
            const updatedLifeConsumable = {
              ...lifeConsumable,
              Consumable: data.consumable,
              Description: data.description,
              Total: +data.total,
              initialDate,
              finalDate
            };

            this.firebaseService.update(`life/${lifeConsumable.Id}`, updatedLifeConsumable)
              .then(() => this.loadLifeConsumables())
              .catch((error) => console.error('Error updating life consumable:', error));
          }
        }
      ]
    });

    await reasonAlert.present();
  }

  async deleteLifeConsumable(lifeConsumable: any) {
    const deleteAlert = await this.alertController.create({
      header: 'DELETE LIFE CONSUMABLE',
      message: `Are you sure you want to delete ${lifeConsumable.Consumable}?`,
      buttons: [
        { text: 'CANCEL', role: 'cancel' },
        {
          text: 'DELETE',
          handler: () => {
            this.firebaseService.deleteDocument('life', lifeConsumable.Id)
              .then(() => this.loadLifeConsumables())
              .catch((error) => console.error('Error deleting life consumable:', error));
          }
        }
      ]
    });

    await deleteAlert.present();
  }
  logout() {
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }

}
