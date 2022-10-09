import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReleasingPageRoutingModule } from './releasing-routing.module';

import { ReleasingPage } from './releasing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReleasingPageRoutingModule
  ],
  declarations: [ReleasingPage]
})
export class ReleasingPageModule {}
