import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectBrokeragesPageRoutingModule } from './project-brokerages-routing.module';

import { ProjectBrokeragesPage } from './project-brokerages.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectBrokeragesPageRoutingModule
  ],
  declarations: [ProjectBrokeragesPage]
})
export class ProjectBrokeragesPageModule {}
