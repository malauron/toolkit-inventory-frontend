import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceivingDetailPage } from './receiving-detail.page';

const routes: Routes = [
  {
    path: ':butcheryReceivingId',
    component: ReceivingDetailPage
  },
  {
    path: '',
    redirectTo: '/tabs/receivings',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/tabs/receivings',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceivingDetailPageRoutingModule {}
