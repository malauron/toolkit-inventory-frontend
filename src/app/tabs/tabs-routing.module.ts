/* eslint-disable max-len */
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
        path: 'inventories',
        loadChildren: () => import('../butchery/inventories/inventories.module').then( m => m.InventoriesPageModule)
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
        path: 'ending-balances',
        loadChildren: () => import('../outlet-inventory/ending-balances/ending-balances.module').then( m => m.EndingBalancesPageModule)
      },
      {
        path: 'inventory-history',
        loadChildren: () => import('../outlet-inventory/inventory-history/inventory-history.module').then( m => m.InventoryHistoryPageModule)
      },
      {
        path: 'sales',
        loadChildren: () => import('../pos/sales/sales.module').then( m => m.SalesPageModule)
      },
      {
        path: 'item-prices',
        loadChildren: () => import('../pos/item-prices/item-prices.module').then(m => m.ItemPricesPageModule)
      },
      {
        path: 'order-items',
        loadChildren: () => import('../pos/order-items/order-items.module').then( m => m.OrderItemsPageModule)
      },
      {
        path: 'butchery-batches',
        loadChildren: () => import('../butchery/butchery-batches/butchery-batches.module').then( m => m.ButcheryBatchesPageModule)
      },
      {
        path: 'vendor-warehouses',
        loadChildren: () => import('../vendor-warehouses/vendor-warehouses.module').then( m => m.VendorWarehousesPageModule)
      },
      {
        path: 'projects',
        loadChildren: () => import('../project-management/projects/projects.module').then( m => m.ProjectsPageModule)
      },
      {
        path: 'project-contracts',
        loadChildren: () => import('../project-management/project-contracts/project-contracts.module').then( m => m.ProjectContractsPageModule)
      },
      {
        path: 'project-clients',
        loadChildren: () => import('../project-management/project-clients/project-clients.module').then( m => m.ProjectClientsPageModule)
      },
      {
        path: 'project-brokers',
        loadChildren: () => import('../project-management/project-brokers/project-brokers.module').then( m => m.ProjectBrokersPageModule)
      },
      {
        path: 'project-brokerages',
        loadChildren: () => import('../project-management/project-brokerages/project-brokerages.module').then( m => m.ProjectBrokeragesPageModule)
      },
      {
        path: 'project-units',
        loadChildren: () => import('../project-management/project-units/project-units.module').then( m => m.ProjectUnitsPageModule)
      },
      {
        path: 'project-payments',
        loadChildren: () => import('../project-management/project-payments/project-payments.module').then( m => m.ProjectPaymentsPageModule)
      },
      {
        path: 'users',
        loadChildren: () => import('../Security/users/users.module').then( m => m.UsersPageModule)
      },
      {
        path: '',
        redirectTo: 'options',
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
