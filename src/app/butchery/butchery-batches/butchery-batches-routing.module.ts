import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ButcheryBatchesPage } from './butchery-batches.page';

const routes: Routes = [
  {
    path: 'butchery-batch',
    loadChildren: () =>
      import('./butchery-batch/butchery-batch.module').then(
        (m) => m.ButcheryBatchPageModule
      ),
  },
  {
    path: '',
    component: ButcheryBatchesPage,
  },
  {
    path: '**',
    redirectTo: '/tabs/buthcery-batches',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BatchesPageRoutingModule {}
