import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MinSasTablePage } from './min-sas-table.page';

const routes: Routes = [
  {
    path: '',
    component: MinSasTablePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MinSasTablePageRoutingModule {}
