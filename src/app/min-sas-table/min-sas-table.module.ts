import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MinSasTablePageRoutingModule } from './min-sas-table-routing.module';

import { MinSasTablePage } from './min-sas-table.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MinSasTablePageRoutingModule
  ],
  declarations: [MinSasTablePage]
})
export class MinSasTablePageModule {}
