import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReleasingsPage } from './releasings.page';

const routes: Routes = [
  {
    path: 'releasing-detail',
    loadChildren: () => import('./releasing-detail/releasing-detail.module').then( m => m.ReleasingDetailPageModule)
  },
  {
    path: '',
    component: ReleasingsPage
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

export class ReleasingsPageRoutingModule {}
