import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductionDetailPage } from './production-detail.page';

const routes: Routes = [
  {
    path: ':butcheryProductionId',
    component: ProductionDetailPage
  },
  {
    path: '',
    redirectTo: '/tabs/productions',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/tabs/productions',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionDetailPageRoutingModule {}
