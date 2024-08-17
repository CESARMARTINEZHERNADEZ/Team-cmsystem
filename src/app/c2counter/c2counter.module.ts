import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { C2counterPageRoutingModule } from './c2counter-routing.module';

import { C2counterPage } from './c2counter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    C2counterPageRoutingModule
  ],
  declarations: [C2counterPage]
})
export class C2counterPageModule {}
