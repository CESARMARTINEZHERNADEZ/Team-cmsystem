import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Cat6tablePage } from './cat6table.page';

const routes: Routes = [
  {
    path: '',
    component: Cat6tablePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Cat6tablePageRoutingModule {}
