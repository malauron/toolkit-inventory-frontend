import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryPrintViewPage } from './inventory-print-view.page';

const routes: Routes = [
  {
    path: ':warehouseId',
    component: InventoryPrintViewPage
  },
  {
    path: '',
    redirectTo: '/tabs/ending-balances',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/tabs/ending-balances',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryPrintViewPageRoutingModule {}
