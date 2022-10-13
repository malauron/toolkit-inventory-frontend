import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReleasingDetailPageRoutingModule } from './releasing-detail-routing.module';

import { ReleasingDetailPage } from './releasing-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReleasingDetailPageRoutingModule
  ],
  declarations: [ReleasingDetailPage]
})
export class ReleasingDetailPageModule {}
