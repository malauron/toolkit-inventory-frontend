import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderDetailPage } from './order-detail.page';

const routes: Routes = [
  {
    path: ':orderId',
    component: OrderDetailPage
  },
  {
    path: '',
    redirectTo: '/tabs/orders',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/tabs/orders',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderDetailPageRoutingModule {}
