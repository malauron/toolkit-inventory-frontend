import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuDetailPage } from './menu-detail.page';

const routes: Routes = [
  {
    path: ':menuId',
    component: MenuDetailPage
  },
  {
    path: '',
    redirectTo: '/tabs/menus',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/tabs/menus',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuDetailPageRoutingModule {}
