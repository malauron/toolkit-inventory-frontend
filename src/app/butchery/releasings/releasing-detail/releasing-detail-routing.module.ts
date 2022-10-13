import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReleasingDetailPage } from './releasing-detail.page';

const routes: Routes = [
  {
    path: ':butcheryReleasingId',
    component: ReleasingDetailPage
  },
  {
    path: '',
    redirectTo: '/tabs/releasings',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/tabs/releasings',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReleasingDetailPageRoutingModule {}
