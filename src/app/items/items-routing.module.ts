import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemsPage } from './items.page';

const routes: Routes = [
  {
    path: 'item-detail',
    loadChildren: () =>
      import('./item-detail/item-detail.module').then(
        (m) => m.ItemDetailPageModule
      ),
  },
  {
    path: '',
    component: ItemsPage,
  },
  {
    path: '**',
    redirectTo: '/tabs/items',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemsPageRoutingModule {}
