import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { C2counterPage } from './c2counter.page';

const routes: Routes = [
  {
    path: '',
    component: C2counterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class C2counterPageRoutingModule {}
