import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DatePickerComponent } from './date-picker.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [DatePickerComponent]
})
export class DatePickerModule{}
