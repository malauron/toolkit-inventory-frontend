import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductionsPage } from './productions.page';

const routes: Routes = [
  {
    path: 'production-detail',
    loadChildren: () => import('./production-detail/production-detail.module').then( m => m.ProductionDetailPageModule)
  },
  {
    path: '',
    component: ProductionsPage
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
export class ProductionsPageRoutingModule {}
