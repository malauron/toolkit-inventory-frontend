import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartMenuPage } from './cart-menu.page';

const routes: Routes = [
  {
    path: ':menuId',
    component: CartMenuPage
  },
  {
    path: '',
    redirectTo: '/tabs/orders',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/tabs/orders',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartMenuPageRoutingModule {}
