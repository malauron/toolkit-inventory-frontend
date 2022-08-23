import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PurchaseDetailPageRoutingModule } from './purchase-detail-routing.module';

import { PurchaseDetailPage } from './purchase-detail.page';
import { CustomerSearchModule } from 'src/app/customers/customer-search/customer-search.module';
import { PurchasedItemModule } from '../purchased-item/purchased-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchaseDetailPageRoutingModule,
    ReactiveFormsModule,
    CustomerSearchModule,
    PurchasedItemModule
  ],
  declarations: [PurchaseDetailPage]
})
export class PurchaseDetailPageModule {}
