import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MinSasCounterPage } from './min-sas-counter.page';

const routes: Routes = [
  {
    path: '',
    component: MinSasCounterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MinSasCounterPageRoutingModule {}
