import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BatteryChartComponent } from './battery-chart.component';

const routes: Routes = [
  {
    path: '',
    component: BatteryChartComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
