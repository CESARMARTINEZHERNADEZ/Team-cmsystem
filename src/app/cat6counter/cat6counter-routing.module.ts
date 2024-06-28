import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Cat6counterPage } from './cat6counter.page';

const routes: Routes = [
  {
    path: '',
    component: Cat6counterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Cat6counterPageRoutingModule {}
