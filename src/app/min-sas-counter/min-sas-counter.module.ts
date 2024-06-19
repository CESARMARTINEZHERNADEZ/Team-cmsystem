import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MinSasCounterPageRoutingModule } from './min-sas-counter-routing.module';

import { MinSasCounterPage } from './min-sas-counter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MinSasCounterPageRoutingModule
  ],
  declarations: [MinSasCounterPage]
})
export class MinSasCounterPageModule {}
