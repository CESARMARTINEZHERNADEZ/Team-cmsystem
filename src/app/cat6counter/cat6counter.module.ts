import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Cat6counterPageRoutingModule } from './cat6counter-routing.module';

import { Cat6counterPage } from './cat6counter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Cat6counterPageRoutingModule
  ],
  declarations: [Cat6counterPage]
})
export class Cat6counterPageModule {}
