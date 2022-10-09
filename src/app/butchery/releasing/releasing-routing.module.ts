import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReleasingPage } from './releasing.page';

const routes: Routes = [
  {
    path: '',
    component: ReleasingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReleasingPageRoutingModule {}
