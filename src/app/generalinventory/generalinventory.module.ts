import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GeneralinventoryPageRoutingModule } from './generalinventory-routing.module';

import { GeneralinventoryPage } from './generalinventory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeneralinventoryPageRoutingModule
  ],
  declarations: [GeneralinventoryPage]
})
export class GeneralinventoryPageModule {}
