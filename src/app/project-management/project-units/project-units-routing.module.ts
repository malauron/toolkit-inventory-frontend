import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectUnitsPage } from './project-units.page';

const routes: Routes = [
  {
    path: 'project-unit-detail',
    loadChildren: () => import('./project-unit-detail/project-unit-detail.module').then( m => m.ProjectUnitDetailPageModule)
  },
  {
    path: '',
    component: ProjectUnitsPage
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
export class ProjectUnitsPageRoutingModule {}
