/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceivingDetailPageRoutingModule } from './receiving-detail-routing.module';

import { ReceivingDetailPage } from './receiving-detail.page';
import { ReceivedItemModule } from '../received-item/received-item.module';
import { VendorSearchModule } from 'src/app/vendors/vendor-search/vendor-search.module';
import { ButcheryBatchSearchModule } from '../../butchery-batches/butchery-batch-search/butchery-batch-search.module';
import { ButcheryBatchInventoryItemSearchModule } from '../../butchery-batches/butchery-batch-inventory-item-search/butchery-batch-inventory-item-search.module';
import { VendorWarehouseSearchModule } from 'src/app/vendor-warehouses/vendor-warehouse-search/vendor-warehouse-search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceivingDetailPageRoutingModule,
    ReceivedItemModule,
    VendorWarehouseSearchModule,
    ButcheryBatchSearchModule,
    ButcheryBatchInventoryItemSearchModule
  ],
  declarations: [ReceivingDetailPage]
})
export class ReceivingDetailPageModule {}
