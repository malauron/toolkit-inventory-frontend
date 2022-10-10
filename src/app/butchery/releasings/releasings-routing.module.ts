import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReleasingsPage } from './releasings.page';

const routes: Routes = [
  {
    path: '',
    component: ReleasingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReleasingsPageRoutingModule {}
