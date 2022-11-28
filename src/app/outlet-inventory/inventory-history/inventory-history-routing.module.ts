import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryHistoryPage } from './inventory-history.page';

const routes: Routes = [
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
