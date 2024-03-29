import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchasesPage } from './purchases.page';

const routes: Routes = [
  {
    path: 'purchase-detail',
    loadChildren: () => import('./purchase-detail/purchase-detail.module').then( m => m.PurchaseDetailPageModule)
  },
  {
    path: '',
    component: PurchasesPage
  },
  {
    path: '**',
    redirectTo: '/tabs/purchases',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchasesPageRoutingModule {}
