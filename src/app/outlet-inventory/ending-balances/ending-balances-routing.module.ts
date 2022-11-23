/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EndingBalancesPage } from './ending-balances.page';

const routes: Routes = [
  {
    path: 'inventory-print-view',
    loadChildren: () => import('./inventory-print-view/inventory-print-view.module').then( m => m.InventoryPrintViewPageModule)
  },
  {
    path: '',
    component: EndingBalancesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EndingBalancesPageRoutingModule {}
