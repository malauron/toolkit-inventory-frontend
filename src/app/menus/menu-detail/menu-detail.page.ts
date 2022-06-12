import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-detail',
  templateUrl: './menu-detail.page.html',
  styleUrls: ['./menu-detail.page.scss'],
})
export class MenuDetailPage implements OnInit {

  pageLabel = 'Menu Detail';
  postButton = 'add';

  menuId: number;

  constructor() { }

  ngOnInit() {
  }

  onSave() {

  }

}
