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
  locations: any[] = [];

  constructor(public userService: UserService, private firebaseService: FirebaseService, private navCtrl: NavController) {}

  async ngOnInit() {
    this.locations = await this.firebaseService.getLocations();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(location: string) {
    console.log('Selected location:', location);
    this.dropdownOpen = false;  // Close the dropdown after selecting
    this.navCtrl.navigateForward(['/c1table'], {
      queryParams: { location: location }
    });
  }
}
