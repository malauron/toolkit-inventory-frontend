import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReleasingDetailPageRoutingModule } from './releasing-detail-routing.module';

import { ReleasingDetailPage } from './releasing-detail.page';
import { ButcheryBatchSearchModule } from '../../butchery-batches/butchery-batch-search/butchery-batch-search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReleasingDetailPageRoutingModule,
    ButcheryBatchSearchModule
  ],
  declarations: [ReleasingDetailPage]
})
export class ReleasingDetailPageModule {}
