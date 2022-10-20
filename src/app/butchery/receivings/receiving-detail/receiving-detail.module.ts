import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceivingDetailPageRoutingModule } from './receiving-detail-routing.module';

import { ReceivingDetailPage } from './receiving-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceivingDetailPageRoutingModule
  ],
  declarations: [ReceivingDetailPage]
})
export class ReceivingDetailPageModule {}
