import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductionDetailPage } from './production-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ProductionDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionDetailPageRoutingModule {}
