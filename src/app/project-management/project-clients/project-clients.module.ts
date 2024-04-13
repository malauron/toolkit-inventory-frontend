import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectClientsPageRoutingModule } from './project-clients-routing.module';

import { ProjectClientsPage } from './project-clients.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectClientsPageRoutingModule
  ],
  declarations: [ProjectClientsPage]
})
export class ProjectClientsPageModule {}
