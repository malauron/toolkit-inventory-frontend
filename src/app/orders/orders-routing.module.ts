import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersPage } from './orders.page';

const routes: Routes = [
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'cart-menu',
    loadChildren: () => import('./cart-menu/cart-menu.module').then( m => m.CartMenuPageModule)
  },
  {
    path: '',
    component: OrdersPage
  },
  {
    path: '**',
    redirectTo: '/tabs/orders',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersPageRoutingModule {}
