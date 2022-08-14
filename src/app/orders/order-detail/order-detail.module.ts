import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxPrintModule } from 'ngx-print';
import { OrderDetailPageRoutingModule } from './order-detail-routing.module';
import { OrderDetailPage } from './order-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxPrintModule,
    OrderDetailPageRoutingModule
  ],
  declarations: [OrderDetailPage]
})
export class OrderDetailPageModule {}
