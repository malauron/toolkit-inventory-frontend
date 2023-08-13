import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoriesPageRoutingModule } from './inventories-routing.module';

import { InventoriesPage } from './inventories.page';
import { NgxPrintModule } from 'ngx-print';
import { WarehouseSearchModule } from 'src/app/warehouses/warehouse-search/warehouse-search.module';
import { VendorWarehouseSearchModule } from 'src/app/vendor-warehouses/vendor-warehouse-search/vendor-warehouse-search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoriesPageRoutingModule,
    NgxPrintModule,
    WarehouseSearchModule,
    VendorWarehouseSearchModule
  ],
  declarations: [InventoriesPage]
})
export class InventoriesPageModule {}
