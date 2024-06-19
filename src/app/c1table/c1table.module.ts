import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { C1tablePageRoutingModule } from './c1table-routing.module';

import { C1tablePage } from './c1table.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    C1tablePageRoutingModule
  ],
  declarations: [C1tablePage]
})
export class C1tablePageModule {}
