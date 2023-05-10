import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryHistoryPrintViewPage } from './inventory-history-print-view.page';

const routes: Routes = [
  {
    path: ':warehouseId',
    component: InventoryHistoryPrintViewPage
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
export class InventoryHistoryPrintViewPageRoutingModule {}
