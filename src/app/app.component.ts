import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from './services/User.Service'; // Ensure the path is correct
import { FirebaseService } from './services/firebase.servicetest'; // Ensure the path is correct

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
 
  dropdownOpen: boolean = false;
  dropdownOpentools: boolean = false;
  dropdowngeneral: boolean = false;
  locations: any[] = [];
  locationstools: any[] = [];
  locationgeneral: any[] = [];

  constructor(
    public userService: UserService,
    private firebaseService: FirebaseService,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    try {
      this.locations = await this.firebaseService.getLocations();
      this.locationstools = await this.firebaseService.getLocationstools();
      this.locationgeneral = await this.firebaseService.getLocationgeneral();
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleDropdowntools() {
    this.dropdownOpentools = !this.dropdownOpentools;
  }

  toggleDropdowngeneral() {
    this.dropdowngeneral = !this.dropdowngeneral;
  }

  selectOption(location: string) {
    console.log('Selected location:', location);
    this.dropdownOpen = false;
    this.navCtrl.navigateForward(['/c1table'], {
      queryParams: { location: location },
    });
  }

  selectOptiontools(location: string) {
    console.log('Selected location:', location);
    this.dropdownOpentools = false;
    this.navCtrl.navigateForward(['/tools'], {
      queryParams: { location: location },
    });
  }

  selectOptiongeneral(location: string) {
    console.log('Selected location:', location);
    this.dropdowngeneral = false;
    this.navCtrl.navigateForward(['/generalinventory'], {
      queryParams: { location: location },
    });
  }
}
