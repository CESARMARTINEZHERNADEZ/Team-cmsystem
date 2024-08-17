import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { C2tablePage } from './c2table.page';

const routes: Routes = [
  {
    path: '',
    component: C2tablePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class C2tablePageRoutingModule {}
