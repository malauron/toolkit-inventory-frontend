import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectPaymentsPage } from './project-payments.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectPaymentsPage
  },
  {
    path: 'project-payment-detail',
    loadChildren: () => import('./project-payment-detail/project-payment-detail.module').then( m => m.ProjectPaymentDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectPaymentsPageRoutingModule {}
