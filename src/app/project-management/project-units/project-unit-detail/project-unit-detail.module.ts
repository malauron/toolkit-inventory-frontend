import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectUnitDetailPageRoutingModule } from './project-unit-detail-routing.module';

import { ProjectUnitDetailPage } from './project-unit-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ProjectUnitDetailPageRoutingModule
  ],
  declarations: [ProjectUnitDetailPage]
})
export class ProjectUnitDetailPageModule {}
