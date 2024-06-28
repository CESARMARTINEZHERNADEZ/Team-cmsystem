import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransceivercounterPage } from './transceivercounter.page';

const routes: Routes = [
  {
    path: '',
    component: TransceivercounterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransceivercounterPageRoutingModule {}
