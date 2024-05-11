import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectPaymentDetailPage } from './project-payment-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectPaymentDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectPaymentDetailPageRoutingModule {}
