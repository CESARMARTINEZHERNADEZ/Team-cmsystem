import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { C1tablePageRoutingModule } from './c1table-routing.module';
import { SerialNumberModalComponent } from '../serial-number-modal/serial-number-modal.component'; // Adjust path as needed
import { SerialNumberlendModalComponent } from '../serial-numberlend-modal/serial-numberlend-modal.component'; // Adjust path as needed
import { C1tablePage } from './c1table.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    C1tablePageRoutingModule
  ],
  declarations: [C1tablePage,  SerialNumberModalComponent, SerialNumberlendModalComponent ]
 
})
export class C1tablePageModule {}
