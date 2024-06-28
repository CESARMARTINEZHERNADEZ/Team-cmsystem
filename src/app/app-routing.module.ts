import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },

  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then(m => m.MenuPageModule)
    
  },
  {
    path: 'c1counter',
    loadChildren: () => import('./c1counter/c1counter.module').then( m => m.C1counterPageModule)
  },
  {
    path: 'c1table',
    loadChildren: () => import('./c1table/c1table.module').then( m => m.C1tablePageModule)
  },
  
  
  {
    path: 'signin',
    loadChildren: () => import('./signin/signin.module').then( m => m.SigninPageModule)
  },
  

  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'min-sas-counter',
    loadChildren: () => import('./min-sas-counter/min-sas-counter.module').then( m => m.MinSasCounterPageModule)
  },
  {
    path: 'min-sas-table',
    loadChildren: () => import('./min-sas-table/min-sas-table.module').then( m => m.MinSasTablePageModule)
  },
  {
    path: 'cat6counter',
    loadChildren: () => import('./cat6counter/cat6counter.module').then( m => m.Cat6counterPageModule)
  },
  {
    path: 'cat6table',
    loadChildren: () => import('./cat6table/cat6table.module').then( m => m.Cat6tablePageModule)
  },
  {
    path: 'transceivercounter',
    loadChildren: () => import('./transceivercounter/transceivercounter.module').then( m => m.TransceivercounterPageModule)
  },
  {
    path: 'transceivertable',
    loadChildren: () => import('./transceivertable/transceivertable.module').then( m => m.TransceivertablePageModule)
  },
 
  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
