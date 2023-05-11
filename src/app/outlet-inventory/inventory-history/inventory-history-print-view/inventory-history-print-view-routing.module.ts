import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryHistoryPrintViewPage } from './inventory-history-print-view.page';

const routes: Routes = [
  {
    path: ':inventoryHistoryId',
    component: InventoryHistoryPrintViewPage
  },
  {
    path: '',
    redirectTo: '/tabs/inventory-history',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/tabs/inventory-history',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryHistoryPrintViewPageRoutingModule {}
