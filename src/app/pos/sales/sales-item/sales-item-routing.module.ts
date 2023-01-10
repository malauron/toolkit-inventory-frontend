import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesItemPage } from './sales-item.page';

const routes: Routes = [
  {
    path: '',
    component: SalesItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesItemPageRoutingModule {}
