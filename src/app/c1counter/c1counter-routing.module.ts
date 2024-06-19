import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { C1counterPage } from './c1counter.page';

const routes: Routes = [
  {
    path: '',
    component: C1counterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class C1counterPageRoutingModule {}
