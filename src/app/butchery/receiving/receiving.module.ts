import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceivingPageRoutingModule } from './receiving-routing.module';

import { ReceivingPage } from './receiving.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceivingPageRoutingModule
  ],
  declarations: [ReceivingPage]
})
export class ReceivingPageModule {}
