import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UomsPage } from './uoms.page';

const routes: Routes = [
  {
    path: '',
    component: UomsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UomsPageRoutingModule {}
