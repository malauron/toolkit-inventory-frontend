import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-add-ons',
  templateUrl: './item-add-ons.component.html',
  styleUrls: ['./item-add-ons.component.scss'],
})
export class ItemAddOnsComponent implements OnInit {

  isButtonVisible = false;

  constructor() { }

  showButton() {
    this.isButtonVisible = true;
  }

  hideButton() {
    this.isButtonVisible = true;
  }

  ngOnInit() {}

}
