import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectBrokersPageRoutingModule } from './project-brokers-routing.module';

import { ProjectBrokersPage } from './project-brokers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectBrokersPageRoutingModule
  ],
  declarations: [ProjectBrokersPage]
})
export class ProjectBrokersPageModule {}
