import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectPaymentsPage } from './project-payments.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectPaymentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectPaymentsPageRoutingModule {}
