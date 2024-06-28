import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransceivertablePageRoutingModule } from './transceivertable-routing.module';

import { TransceivertablePage } from './transceivertable.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransceivertablePageRoutingModule
  ],
  declarations: [TransceivertablePage]
})
export class TransceivertablePageModule {}
