import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceivingsPage } from './receivings.page';

const routes: Routes = [
  {
    path: 'receiving-detail',
    loadChildren: () => import('./receiving-detail/receiving-detail.module').then( m => m.ReceivingDetailPageModule)
  },
  {
    path: '',
    component: ReceivingsPage
  },
  {
    path: '**',
    redirectTo: 'tabs/receivings',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceivingsPageRoutingModule {}
