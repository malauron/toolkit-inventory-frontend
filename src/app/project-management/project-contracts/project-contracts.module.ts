import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectContractsPageRoutingModule } from './project-contracts-routing.module';

import { ProjectContractsPage } from './project-contracts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectContractsPageRoutingModule
  ],
  declarations: [ProjectContractsPage]
})
export class ProjectContractsPageModule {}
