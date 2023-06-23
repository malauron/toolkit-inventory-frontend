import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-on-detail',
  templateUrl: './add-on-detail.component.html',
  styleUrls: ['./add-on-detail.component.scss'],
})
export class AddOnDetailComponent implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss(null,'dismissModal');
  }

}
