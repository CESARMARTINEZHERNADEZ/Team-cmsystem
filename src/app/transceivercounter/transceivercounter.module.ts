import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransceivercounterPageRoutingModule } from './transceivercounter-routing.module';

import { TransceivercounterPage } from './transceivercounter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransceivercounterPageRoutingModule
  ],
  declarations: [TransceivercounterPage]
})
export class TransceivercounterPageModule {}
