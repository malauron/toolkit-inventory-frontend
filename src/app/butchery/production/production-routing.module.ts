import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductionPage } from './production.page';

const routes: Routes = [
  {
    path: '',
    component: ProductionPage
  },
  {
    path: 'production-detail',
    loadChildren: () => import('./production-detail/production-detail.module').then( m => m.ProductionDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionPageRoutingModule {}
