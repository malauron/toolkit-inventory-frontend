import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {

  dateValue = format(new Date(), 'yyyy-MM-dd');

  constructor(
    private mdl: ModalController
  ) { }

  ngOnInit() {}

  valueChanged(value) {
    this.dateValue = value;
  }

  setDate(){
    this.mdl.dismiss(this.dateValue, 'setDate');
  }
  dismissModal(){
    this.mdl.dismiss(null, 'dismissModal');
  }

}
