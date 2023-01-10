import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesPage } from './sales.page';

const routes: Routes = [
  {
    path: 'sales-detail',
    loadChildren: () => import('./sales-detail/sales-detail.module').then( m => m.SalesDetailPageModule)
  },
  {
    path: '',
    component: SalesPage
  },
  {
    path: '**',
    redirectTo: '/tabs/sales',
    pathMatch: 'full'
  },
  {
    path: 'sales-item',
    loadChildren: () => import('./sales-item/sales-item.module').then( m => m.SalesItemPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesPageRoutingModule {}
