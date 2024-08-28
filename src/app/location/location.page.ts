import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.servicetest';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { UserService } from '../services/User.Service';

export interface Location {
  id: string;
  location: string;
  description: string;
  creator: string;
  date: string;
}

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss', '../app.component.scss'],
})
export class LocationPage implements OnInit {
  locations: any[] = [];
  

  constructor(
    private userService: UserService,
    private router: Router,
    private firebaseService: FirebaseService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadLocations();
  }

  ionViewWillEnter() {
    const user = this.userService.getUser();
    if (!user) {
      this.router.navigate(['/dashboard']);
    } else {
      this.loadLocations(); // Refresh the data every time the page is accessed
    }
  }

  logout() {
    this.userService.clearUser();
    this.router.navigate(['/dashboard']);
  }

  async addLocation() {
    const alert = await this.alertController.create({
      header: 'Add Location',
      inputs: [
        { name: 'location', type: 'text', placeholder: 'Location' },
        { name: 'description', type: 'text', placeholder: 'Description' }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Add',
          handler: async (data) => {
            if (!data.location || !data.description) {
              const alert = await this.alertController.create({
                header: 'Missing Fields',
                message: 'All fields must be filled out. Please complete the form.',
                buttons: ['OK']
              });
              await alert.present();
              return;
            }
  
            const user = this.userService.getUser();
            const id = this.firebaseService.generateDocId('locations');
            const locationData = {
              id: id,
              location: data.location,
              description: data.description,
              creator: user ? user.fullName : 'Unknown',
              date: moment().format('YYYY-MM-DD HH:mm:ss')
            };
            await this.firebaseService.setCollectionWithId('locations', id, locationData);
            this.loadLocations(); // Refresh the list after adding a new location
          }
        }
      ]
    });
  
    await alert.present();
  }
  

  async updateLocation(location: any) {
    const alert = await this.alertController.create({
      header: 'Update Location',
      inputs: [
        { name: 'location', type: 'text', placeholder: 'Location', value: location.location },
        { name: 'description', type: 'text', placeholder: 'Description', value: location.description }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Update',
          handler: async (data) => {
            if (!data.location || !data.description) {
              const alert = await this.alertController.create({
                header: 'Missing Fields',
                message: 'All fields must be filled out. Please complete the form.',
                buttons: ['OK']
              });
              await alert.present();
              return;
            }
  
            const updatedLocation = {
              location: data.location,
              description: data.description
            };
            
            // Actualiza el documento usando el ID
            await this.firebaseService.updateDocument('locations', location.id, updatedLocation);
            this.loadLocations(); // Refresca la lista después de actualizar la ubicación
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  async deleteLocation(locationId: string) {
    const alert = await this.alertController.create({
      header: 'Delete Location',
      message: 'Are you sure you want to delete this location?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          handler: async () => {
            // Elimina el documento usando el ID
            await this.firebaseService.deleteDocument('locations', locationId);
            this.loadLocations(); // Refresca la lista después de eliminar la ubicación
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  loadLocations() {
    this.firebaseService.getCollection('locations').subscribe(data => {
      this.locations = data;
    });
  }
  
}
