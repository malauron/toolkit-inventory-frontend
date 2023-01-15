import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesDetailPageRoutingModule } from './sales-detail-routing.module';

import { SalesDetailPage } from './sales-detail.page';
import { SalesItemPageModule } from '../sales-item/sales-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesDetailPageRoutingModule,
    SalesItemPageModule
  ],
  declarations: [SalesDetailPage]
})
export class SalesDetailPageModule {}
