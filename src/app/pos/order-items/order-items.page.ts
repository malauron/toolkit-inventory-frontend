import { Component, OnInit } from '@angular/core';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { User } from 'src/app/Security/classes/user.model';
import { AuthenticationService } from 'src/app/Security/services/authentication.service';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.page.html',
  styleUrls: ['./order-items.page.scss'],
})
export class OrderItemsPage implements OnInit {

  warehouse: Warehouse;
  user: User;

  isFetching = false;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.warehouse = new Warehouse();
    this.user = this.authenticationService.getUserFromLocalCache();
    console.log(this.user.userId);
  }

  onWarehouseSearch(){}

}
