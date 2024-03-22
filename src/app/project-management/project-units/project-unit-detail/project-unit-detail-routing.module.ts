import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectUnitDetailPage } from './project-unit-detail.page';

const routes: Routes = [
  {
    path: ':unitId',
    component: ProjectUnitDetailPage
  },
  {
    path: '',
    redirectTo: '/tabs/project-units',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/tabs/project-units',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectUnitDetailPageRoutingModule {}
