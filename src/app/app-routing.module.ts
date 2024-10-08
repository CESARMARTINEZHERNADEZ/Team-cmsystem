import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },

  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then(m => m.MenuPageModule)
    
  },
 
  {
    path: 'c1table',
    loadChildren: () => import('./c1table/c1table.module').then( m => m.C1tablePageModule)
  },
  
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'life',
    loadChildren: () => import('./life/life.module').then( m => m.LifePageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'c2counter',
    loadChildren: () => import('./c2counter/c2counter.module').then( m => m.C2counterPageModule)
  },
  {
    path: 'c2table',
    loadChildren: () => import('./c2table/c2table.module').then( m => m.C2tablePageModule)
  },
  {
    path: 'cycle',
    loadChildren: () => import('./cycle/cycle.module').then( m => m.CyclePageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then( m => m.UserPageModule)
  },
  {
    path: 'location',
    loadChildren: () => import('./location/location.module').then( m => m.LocationPageModule)
  },
  {
    path: 'tools',
    loadChildren: () => import('./tools/tools.module').then( m => m.ToolsPageModule)
  },
  {
    path: 'generalinventory',
    loadChildren: () => import('./generalinventory/generalinventory.module').then( m => m.GeneralinventoryPageModule)
  },





  
 


 
  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
