import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransceivertablePage } from './transceivertable.page';

const routes: Routes = [
  {
    path: '',
    component: TransceivertablePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransceivertablePageRoutingModule {}
