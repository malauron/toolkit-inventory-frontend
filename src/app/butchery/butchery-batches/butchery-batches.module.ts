import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BatchesPageRoutingModule } from './butchery-batches-routing.module';

import { ButcheryBatchesPage } from './butchery-batches.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BatchesPageRoutingModule
  ],
  declarations: [ButcheryBatchesPage]
})
export class ButcheryBatchesPageModule {}
