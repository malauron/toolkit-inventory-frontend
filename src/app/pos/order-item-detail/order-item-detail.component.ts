import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-order-item-detail',
  templateUrl: './order-item-detail.component.html',
  styleUrls: ['./order-item-detail.component.scss'],
})
export class OrderItemDetailComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismissModal(){
    this.modalController.dismiss(null, 'dismissModal');
  }
}
