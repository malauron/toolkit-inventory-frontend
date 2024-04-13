import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectBrokeragesPage } from './project-brokerages.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectBrokeragesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectBrokeragesPageRoutingModule {}
