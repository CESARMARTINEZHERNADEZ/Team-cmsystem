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

  constructor(
    private userService: UserService,
    private router: Router,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    const user = this.userService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
    }

    this.loadButtonStyles();
  }

  logout() {
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }

  loadButtonStyles() {
    const collections = {
      'c1counter': 'consumables',
      'min-sas-counter': 'MiniSAS',
      'cat6counter': 'Cat6',
      'transceivercounter': 'Transceiver'
    };

    for (const [route, collection] of Object.entries(collections)) {
      this.firebaseService.getCollectionData(collection).subscribe((data: any[]) => {
        let subtotal = 0;
        let minLevel = 0;
        let maxLevel = 0;

        data.forEach(item => {
          subtotal += item.SubTotal || 0;
          minLevel = item.MinimumLevel || minLevel;
          maxLevel = item.MaximumLevel || maxLevel;
        });

        if (subtotal <= minLevel) {
          this.buttonStyles[route] = 'red-button';
        } else if (maxLevel >= subtotal) {
          this.buttonStyles[route] = 'blue-button';
        }
      });
    }
  }
}
