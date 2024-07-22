import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LifePageRoutingModule } from './life-routing.module';

import { LifePage } from './life.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LifePageRoutingModule
  ],
  declarations: [LifePage]
})
export class LifePageModule {}
