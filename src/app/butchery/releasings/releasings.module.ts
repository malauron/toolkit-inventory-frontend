import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReleasingsPageRoutingModule } from './releasings-routing.module';

import { ReleasingsPage } from './releasings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReleasingsPageRoutingModule
  ],
  declarations: [ReleasingsPage]
})
export class ReleasingsPageModule {}
