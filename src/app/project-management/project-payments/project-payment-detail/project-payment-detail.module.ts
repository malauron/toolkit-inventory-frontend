import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectPaymentDetailPageRoutingModule } from './project-payment-detail-routing.module';

import { ProjectPaymentDetailPage } from './project-payment-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ProjectPaymentDetailPageRoutingModule
  ],
  declarations: [ProjectPaymentDetailPage]
})
export class ProjectPaymentDetailPageModule {}
