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
  charge: number = 30;   // Carga actual
  capacity: number = 100; // Capacidad total
  batteryLevel: number = 0; // Nivel de batería
  batteryClass: string = 'normal'; // Clase para el color de la batería

  // Define el umbral para cambio de color
  private readonly warningThreshold: number = 30; // Umbral para color naranja
  private readonly criticalThreshold: number = 10; // Umbral para color rojo
  collections = [
    { name: 'consumables', displayName: 'Cage A' },
    { name: 'c2consumables', displayName: 'Cage B' },
    
  ];
  documents: { [key: string]: any[] } = {};
  selectedCollection: string = 'consumables'; // Colección seleccionada por defecto

  constructor(
    private userService: UserService,
    private router: Router,
    private firebaseService: FirebaseService,
    
  ) {
  }

  // Método para actualizar el nivel de batería y el color
  updateBatteryLevel() {
    if (this.capacity > 0) {
      this.batteryLevel = (this.charge / this.capacity) * 100;
      this.updateBatteryClass();
    } else {
      this.batteryLevel = 0; // Evitar división por cero
      this.batteryClass = 'normal'; // Configura color por defecto
    }
  }

  // Método para actualizar la clase de la batería
  updateBatteryClass() {
    if (this.batteryLevel <= this.criticalThreshold) {
      this.batteryClass = 'critical'; // Rojo
    } else if (this.batteryLevel <= this.warningThreshold) {
      this.batteryClass = 'warning'; // Naranja
    } else {
      this.batteryClass = 'normal'; // Verde
    }
  }

  ngOnInit() {
 
    this.updateBatteryLevel();
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
