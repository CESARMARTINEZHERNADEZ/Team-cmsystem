import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { C1tablePage } from './c1table.page';

const routes: Routes = [
  {
    path: '',
    component: C1tablePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class C1tablePageRoutingModule {}
