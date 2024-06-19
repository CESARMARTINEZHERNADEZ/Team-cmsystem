import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { C1counterPageRoutingModule } from './c1counter-routing.module';

import { C1counterPage } from './c1counter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    C1counterPageRoutingModule
  ],
  declarations: [C1counterPage]
})
export class C1counterPageModule {}
