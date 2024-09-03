import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneralinventoryPage } from './generalinventory.page';

const routes: Routes = [
  {
    path: '',
    component: GeneralinventoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralinventoryPageRoutingModule {}
