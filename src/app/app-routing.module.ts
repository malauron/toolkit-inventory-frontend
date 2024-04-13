/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './Security/Guards/authentication.guard';

const routes: Routes = [

  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule),
    canLoad: [AuthenticationGuard]
  },
  {
    path: 'authentication',
    loadChildren: () => import('./Security/authentication/authentication.module').then( m => m.AuthenticationPageModule)
  },
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },  {
    path: 'project-contracts',
    loadChildren: () => import('./project-management/project-contracts/project-contracts.module').then( m => m.ProjectContractsPageModule)
  },
  {
    path: 'project-clients',
    loadChildren: () => import('./project-management/project-clients/project-clients.module').then( m => m.ProjectClientsPageModule)
  },
  {
    path: 'project-brokers',
    loadChildren: () => import('./project-management/project-brokers/project-brokers.module').then( m => m.ProjectBrokersPageModule)
  },
  {
    path: 'project-brokerages',
    loadChildren: () => import('./project-management/project-brokerages/project-brokerages.module').then( m => m.ProjectBrokeragesPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
