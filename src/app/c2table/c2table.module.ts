import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { C2tablePageRoutingModule } from './c2table-routing.module';

import { C2tablePage } from './c2table.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    C2tablePageRoutingModule
  ],
  declarations: [C2tablePage]
})
export class C2tablePageModule {}
