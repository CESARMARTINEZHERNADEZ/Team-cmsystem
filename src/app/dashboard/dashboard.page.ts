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
  locations: string[] = [];
  documents: any[] = [];
  selectedLocation: string = ''; // Ubicación seleccionada por defecto

  constructor(
    private userService: UserService,
    private router: Router,
    private firebaseService: FirebaseService,
  ) {}

  ngOnInit() {
    this.loadLocations();
  }

  loadLocations() {
    this.firebaseService.getCollection('locations').subscribe((locationsData: any[]) => {
      this.locations = locationsData
        .map(location => location.location)
        .sort(); // Ordena las ubicaciones alfabéticamente
  
      if (this.locations.length > 0) {
        this.selectedLocation = this.locations[0];
        this.loadDocuments();
      }
    });
  }
  loadDocuments() {
    if (this.selectedLocation) {
      this.firebaseService.getCollectionData('consumables').subscribe((data: any[]) => {
        this.documents = data.filter(doc => doc.location === this.selectedLocation);
      });
    }
  }

  logout() {
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }

  toggleDetails(doc: any) {
    doc.showDetails = !doc.showDetails;
  }

  getButtonClass(doc: any): string {
    const halfRange = doc.MinimumLevel + (doc.MaximumLevel - doc.MinimumLevel) / 2;
    if (doc.SubTotal <= doc.MinimumLevel) {
      return 'red-button';
    } else if (doc.SubTotal > doc.MinimumLevel && doc.SubTotal <= halfRange) {
      return 'default-button';
    } else {
      return 'blue-button';
    }
  }

  getBatteryLevel(doc: any): number {
    if (doc.total > 0) {
      return ((doc.SubTotal / doc.MaximumLevel) * 100);
    }
    return 0;
  }

  getMinimumLevelPercent(doc: any): number {
    if (doc.total > 0) {
      return (doc.MinimumLevel / doc.MaximumLevel) * 100;
    }
    return 0;
  }

  getBatteryClass(doc: any): string {
    const halfRange = doc.MinimumLevel + (doc.MaximumLevel - doc.MinimumLevel) / 2;
    if (doc.SubTotal <= doc.MinimumLevel) {
      return 'critical';
    } else if (doc.SubTotal > doc.MinimumLevel && doc.SubTotal <= halfRange) {
      return 'warning';
    } else {
      return 'normal';
    }
  }
}
