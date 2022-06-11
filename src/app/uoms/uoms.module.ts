import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UomsPageRoutingModule } from './uoms-routing.module';

import { UomsPage } from './uoms.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UomsPageRoutingModule
  ],
  declarations: [UomsPage]
})
export class UomsPageModule {}
