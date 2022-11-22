import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EndingBalancesPage } from './ending-balances.page';

const routes: Routes = [
  {
    path: '',
    component: EndingBalancesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EndingBalancesPageRoutingModule {}
