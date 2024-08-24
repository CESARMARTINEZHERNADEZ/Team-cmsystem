import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  dropdownOpen: boolean = false;
  constructor() {}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(option: string) {
    console.log('Opción seleccionada:', option);
    this.dropdownOpen = false;  // Cerrar el dropdown después de seleccionar
  }

}


