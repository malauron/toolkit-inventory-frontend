import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ButcheryBatchDetailItemComponent } from './butchery-batch-detail-item.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [ButcheryBatchDetailItemComponent]
})
export class ButcheryBatchDetailItemModule{}
