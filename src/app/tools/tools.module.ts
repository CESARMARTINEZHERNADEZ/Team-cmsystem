import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ToolsPageRoutingModule } from './tools-routing.module';
import { LendModalComponent } from '../lend-modal/lend-modal.component';


import { ToolsPage } from './tools.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ToolsPageRoutingModule
  ],
  declarations: [ToolsPage, LendModalComponent ]
})
export class ToolsPageModule {}

