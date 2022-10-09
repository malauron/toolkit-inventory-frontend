import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceivingPage } from './receiving.page';

const routes: Routes = [
  {
    path: '',
    component: ReceivingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceivingPageRoutingModule {}
