import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'orders',
        loadChildren: () => import('../orders/orders.module').then( m => m.OrdersPageModule)
      },
      {
        path: 'purchases',
        loadChildren: () => import('../purchases/purchases.module').then( m => m.PurchasesPageModule)
      },
      {
        path: 'menus',
        loadChildren: () => import('../menus/menus.module').then( m => m.MenusPageModule)
      },
      {
        path: 'items',
        loadChildren: () => import('../items/items.module').then( m => m.ItemsPageModule)
      },
      {
        path: 'uoms',
        loadChildren: () => import('../uoms/uoms.module').then( m => m.UomsPageModule)
      },
      {
        path: 'customers',
        loadChildren: () => import('../customers/customers.module').then( m => m.CustomersPageModule)
      },
      {
        path: 'vendors',
        loadChildren: () => import('../vendors/vendors.module').then( m => m.VendorsPageModule)
      },
      {
        path: 'warehouses',
        loadChildren: () => import('../warehouses/warehouses.module').then( m => m.WarehousesPageModule)
      },
      {
        path: 'options',
        loadChildren: () => import('../options/options.module').then( m => m.OptionsPageModule)
      },
      {
        path: 'receivings',
        loadChildren: () => import('../butchery/receivings/receivings.module').then( m => m.ReceivingsPageModule)
      },
      {
        path: 'productions',
        loadChildren: () => import('../butchery/productions/productions.module').then( m => m.ProductionsPageModule)
      },
      {
        path: 'releasings',
        loadChildren: () => import('../butchery/releasings/releasings.module').then( m => m.ReleasingsPageModule)
      },
      {
        path: '',
        redirectTo: 'orders',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'orders',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
