import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceivingDetailPageRoutingModule } from './receiving-detail-routing.module';

import { ReceivingDetailPage } from './receiving-detail.page';
import { ReceivedItemModule } from '../received-item/received-item.module';
import { VendorSearchModule } from 'src/app/vendors/vendor-search/vendor-search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceivingDetailPageRoutingModule,
    ReceivedItemModule,
    VendorSearchModule
  ],
  declarations: [ReceivingDetailPage]
})
export class ReceivingDetailPageModule {}
