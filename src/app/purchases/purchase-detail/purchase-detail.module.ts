import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PurchaseDetailPageRoutingModule } from './purchase-detail-routing.module';

import { PurchaseDetailPage } from './purchase-detail.page';
import { PurchasedItemModule } from '../purchased-item/purchased-item.module';
import { VendorSearchModule } from 'src/app/vendors/vendor-search/vendor-search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchaseDetailPageRoutingModule,
    ReactiveFormsModule,
    VendorSearchModule,
    PurchasedItemModule
  ],
  declarations: [PurchaseDetailPage]
})
export class PurchaseDetailPageModule {}
