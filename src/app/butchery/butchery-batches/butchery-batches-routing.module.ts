import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ButcheryBatchesPage } from './butchery-batches.page';

const routes: Routes = [
  {
    path: '',
    component: ButcheryBatchesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BatchesPageRoutingModule {}
