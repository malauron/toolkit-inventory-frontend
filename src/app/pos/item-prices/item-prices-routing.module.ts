import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemPricesPage } from './item-prices.page';

const routes: Routes = [
  {
    path: '',
    component: ItemPricesPage
  },
  {
    path: '**',
    redirectTo: '/tabs/sales',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemPricesPageRoutingModule {}
