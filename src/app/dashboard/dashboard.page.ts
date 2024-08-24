import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.servicetest';
import { UserService } from '../services/User.Service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss', '../app.component.scss'],
})
export class DashboardPage implements OnInit {
  collections = [
    { name: 'consumables', displayName: 'Cage A' },
    { name: 'c2consumables', displayName: 'Cage B' },
  ];
  documents: { [key: string]: any[] } = {};
  selectedCollection: string = 'consumables'; // Colección seleccionada por defecto

  constructor(
    private userService: UserService,
    private router: Router,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.loadDocuments();
  }

  logout() {
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }

  loadDocuments() {
    this.collections.forEach(collection => {
      this.firebaseService.getCollectionData(collection.name).subscribe((data: any[]) => {
        this.documents[collection.name] = data.map(doc => ({
          ...doc,
          showDetails: false
        }));
      });
    });
  }

  toggleDetails(doc: any) {
    doc.showDetails = !doc.showDetails;
  }

  getButtonClass(doc: any): string {
    if (doc.SubTotal <= doc.MinimumLevel) {
      return 'red-button';
    } else if (doc.SubTotal >= doc.MaximumLevel) {
      return 'blue-button';
    } else {
      return 'default-button';
    }
  }
}
