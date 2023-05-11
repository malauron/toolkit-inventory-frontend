/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryHistoryPage } from './inventory-history.page';

const routes: Routes = [
  {
    path: 'inventory-history-print-view',
    loadChildren: () => import('./inventory-history-print-view/inventory-history-print-view.module').then(m => m.InventoryHistoryPrintViewPageModule)
  },
  {
    path: '',
    component: InventoryHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryHistoryPageRoutingModule {}
