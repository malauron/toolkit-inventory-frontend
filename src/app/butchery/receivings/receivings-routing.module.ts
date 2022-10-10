import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceivingsPage } from './receivings.page';

const routes: Routes = [
  {
    path: '',
    component: ReceivingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceivingsPageRoutingModule {}
