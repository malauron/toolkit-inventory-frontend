import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceivingsPageRoutingModule } from './receivings-routing.module';

import { ReceivingsPage } from './receivings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceivingsPageRoutingModule
  ],
  declarations: [ReceivingsPage]
})
export class ReceivingsPageModule {}
