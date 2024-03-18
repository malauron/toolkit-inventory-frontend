import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectUnitsPageRoutingModule } from './project-units-routing.module';

import { ProjectUnitsPage } from './project-units.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectUnitsPageRoutingModule
  ],
  declarations: [ProjectUnitsPage]
})
export class ProjectUnitsPageModule {}
