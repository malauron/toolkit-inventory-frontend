import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartMenuPage } from './cart-menu.page';

const routes: Routes = [
  {
    path: '',
    component: CartMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartMenuPageRoutingModule {}
