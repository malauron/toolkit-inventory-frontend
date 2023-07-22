import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ButcheryBatchPageRoutingModule } from './butchery-batch-routing.module';

import { ButcheryBatchPage } from './butchery-batch.page';
import { VendorSearchModule } from 'src/app/vendors/vendor-search/vendor-search.module';
import { VendorWarehouseSearchModule } from 'src/app/vendor-warehouses/vendor-warehouse-search/vendor-warehouse-search.module';
import { ButcheryBatchDetailModule } from '../butchery-batch-detail/butchery-batch-detail.module';
import { ButcheryBatchDetailItemModule } from '../butchery-batch-detail-item/butchery-batch-detail-item.module';
import { ItemSearchModule } from 'src/app/items/item-search/item-search.module';
import { UomSearchModule } from 'src/app/uoms/uom-search/uom-search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ButcheryBatchPageRoutingModule,
    ButcheryBatchDetailModule,
    ButcheryBatchDetailItemModule,
    VendorSearchModule,
    VendorWarehouseSearchModule,
    ItemSearchModule,
    UomSearchModule,
  ],
  declarations: [ButcheryBatchPage]
})
export class ButcheryBatchPageModule {}
