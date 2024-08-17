import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.servicetest';
import { UserService } from '../services/User.Service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  buttonStyles: { [key: string]: string } = {};
  consumablesByCollection: { [key: string]: string[] } = {}; // To store consumables for each collection

  constructor(
    private userService: UserService,
    private router: Router,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    const user = this.userService.getUser();
    if (!user) {
      this.router.navigate(['/dashboard']);
    }

    this.loadButtonStyles();
  }

  logout() {
    this.userService.clearUser();
    this.router.navigate(['/dashboard']);
  }

  loadButtonStyles() {
    const collections = {
      'c1counter': 'consumables',
      'c2counter': 'c2consumables',
    };

    for (const [route, collection] of Object.entries(collections)) {
      this.firebaseService.getCollectionData(collection).subscribe((data: any[]) => {
        let shouldStyleRed = false;
        let shouldStyleBlue = false;

        // Initialize the list of consumables for each route
        this.consumablesByCollection[route] = [];

        data.forEach(item => {
          // Add the consumable name to the respective route list
          this.consumablesByCollection[route].push(item.Consumable);

          if (item.SubTotal <= item.MinimumLevel) {
            shouldStyleRed = true;
          }
          if (item.SubTotal >= item.MaximumLevel) {
            shouldStyleBlue = true;
          }
        });

        if (shouldStyleRed) {
          this.buttonStyles[route] = 'red-button';
        } else if (shouldStyleBlue) {
          this.buttonStyles[route] = 'blue-button';
        } else {
          this.buttonStyles[route] = 'default-button';
        }
      });
    }
  }
}
