import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ButcheryBatchPage } from './butchery-batch.page';

const routes: Routes = [
  {
    path: ':batchId',
    component: ButcheryBatchPage
  },
  {
    path: '',
    redirectTo: '/tabs/butchery-batches',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/tabs/butchery-batches',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ButcheryBatchPageRoutingModule {}
