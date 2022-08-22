import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PurchaseDetailPageRoutingModule } from './purchase-detail-routing.module';

import { PurchaseDetailPage } from './purchase-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchaseDetailPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PurchaseDetailPage]
})
export class PurchaseDetailPageModule {}
