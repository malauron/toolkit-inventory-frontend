import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectContractsPage } from './project-contracts.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectContractsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectContractsPageRoutingModule {}
