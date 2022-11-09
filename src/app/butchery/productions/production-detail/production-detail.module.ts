import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductionDetailPageRoutingModule } from './production-detail-routing.module';

import { ProductionDetailPage } from './production-detail.page';
import { ProductionSourceModule } from '../production-source/production-source.module';
import { ReceivingItemSearchModule } from '../../receivings/receiving-item-search/receiving-item-search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductionDetailPageRoutingModule,
    ProductionSourceModule,
    ReceivingItemSearchModule
  ],
  declarations: [ProductionDetailPage]
})
export class ProductionDetailPageModule {}
