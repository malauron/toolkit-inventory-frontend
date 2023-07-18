import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { DatePickerComponent } from 'src/app/custom-controls/date-picker/date-picker.component';

@Component({
  selector: 'app-butchery-batch',
  templateUrl: './butchery-batch.page.html',
  styleUrls: ['./butchery-batch.page.scss'],
})
export class ButcheryBatchPage implements OnInit {

  pageLabel = 'Batch';

  dateValue;

  constructor(
    private mdl: ModalController
  ) { }

  ngOnInit() {
  }

  showReceivedDatePicker() {
    this.mdl
    .create({
      component: DatePickerComponent,
      cssClass: 'custom-modal-styles',
    })
    .then((modal) => {
      modal.present();
      return modal.onDidDismiss();
    })
    .then((modal) => {
      if (modal.role === 'setDate') {
        this.dateValue =format(parseISO(modal.data), 'MMMM dd, yyyy');
      }
    });
  }

  // onDateChanged() {
  //   console.log(format(new Date(), 'yyyy-MM-dd'));
  //   console.log(this.dateValue);
  // }

}
