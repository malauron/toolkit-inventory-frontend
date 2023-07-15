import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ButcheryBatchPageRoutingModule } from './butchery-batch-routing.module';

import { ButcheryBatchPage } from './butchery-batch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ButcheryBatchPageRoutingModule
  ],
  declarations: [ButcheryBatchPage]
})
export class ButcheryBatchPageModule {}
