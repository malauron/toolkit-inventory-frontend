import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemDetailPage } from './item-detail.page';

const routes: Routes = [
  {
    path: ':itemId',
    component: ItemDetailPage
  },
  {
    path: '',
    redirectTo: '/tabs/items',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/tabs/items',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemDetailPageRoutingModule {}
