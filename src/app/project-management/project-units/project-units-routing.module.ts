import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectUnitsPage } from './project-units.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectUnitsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectUnitsPageRoutingModule {}
