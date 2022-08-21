import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchaseDetailPage } from './purchase-detail.page';

const routes: Routes = [
  {
    path: ':purchaseId',
    component: PurchaseDetailPage
  },
  {
    path: '',
    redirectTo: '/tabs/purchases',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/tabs/purchases',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseDetailPageRoutingModule {}
