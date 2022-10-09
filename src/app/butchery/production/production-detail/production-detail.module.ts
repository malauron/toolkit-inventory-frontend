import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductionDetailPageRoutingModule } from './production-detail-routing.module';

import { ProductionDetailPage } from './production-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductionDetailPageRoutingModule
  ],
  declarations: [ProductionDetailPage]
})
export class ProductionDetailPageModule {}
