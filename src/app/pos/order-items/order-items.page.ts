import { Component, OnInit } from '@angular/core';
import { Warehouse } from 'src/app/classes/warehouse.model';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.page.html',
  styleUrls: ['./order-items.page.scss'],
})
export class OrderItemsPage implements OnInit {

  warehouse: Warehouse;

  isFetching = false;

  constructor() { }

  ngOnInit() {
    this.warehouse = new Warehouse();
  }

  onWarehouseSearch(){}

}
