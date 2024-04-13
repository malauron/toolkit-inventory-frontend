import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectBrokersPage } from './project-brokers.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectBrokersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectBrokersPageRoutingModule {}
