import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ButcheryBatchPageRoutingModule } from './butchery-batch-routing.module';

import { ButcheryBatchPage } from './butchery-batch.page';
import { VendorSearchModule } from 'src/app/vendors/vendor-search/vendor-search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ButcheryBatchPageRoutingModule,
    VendorSearchModule
  ],
  declarations: [ButcheryBatchPage]
})
export class ButcheryBatchPageModule {}
