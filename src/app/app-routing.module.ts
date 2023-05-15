/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './Security/Guards/authentication.guard';

const routes: Routes = [

  {
    path: 'authentication',
    loadChildren: () => import('./Security/authentication/authentication.module').then( m => m.AuthenticationPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule),
    canLoad: [AuthenticationGuard]
  },
  {
    path: '',
    redirectTo: 'authentication',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'authentication',
    pathMatch: 'full'
  },  {
    path: 'item-prices',
    loadChildren: () => import('./pos/item-prices/item-prices.module').then( m => m.ItemPricesPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
