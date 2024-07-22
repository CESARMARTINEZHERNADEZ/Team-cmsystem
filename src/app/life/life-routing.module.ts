import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LifePage } from './life.page';

const routes: Routes = [
  {
    path: '',
    component: LifePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LifePageRoutingModule {}
