import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectPaymentsPageRoutingModule } from './project-payments-routing.module';

import { ProjectPaymentsPage } from './project-payments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectPaymentsPageRoutingModule
  ],
  declarations: [ProjectPaymentsPage]
})
export class ProjectPaymentsPageModule {}
