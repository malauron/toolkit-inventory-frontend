import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerDetailPage } from './customer-detail.page';

const routes: Routes = [
  {
    path: ':customerId',
    component: CustomerDetailPage
  },
  {
    path: '',
    redirectTo: '/tabs/customers',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/tabs/customers',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerDetailPageRoutingModule {}
