import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Cat6tablePageRoutingModule } from './cat6table-routing.module';

import { Cat6tablePage } from './cat6table.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Cat6tablePageRoutingModule
  ],
  declarations: [Cat6tablePage]
})
export class Cat6tablePageModule {}
