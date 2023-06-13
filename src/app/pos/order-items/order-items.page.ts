/* eslint-disable no-underscore-dangle */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { User } from 'src/app/Security/classes/user.model';
import { AuthenticationService } from 'src/app/Security/services/authentication.service';
import { WarehousesService } from 'src/app/services/warehouses.service';
import { PosItemPricesService } from '../services/pos-item-prices.service';
import { PosItemPrice } from '../classes/pos-item-price.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.page.html',
  styleUrls: ['./order-items.page.scss'],
})
export class OrderItemsPage implements OnInit {
  @ViewChild('infiniteScroll') infiniteScroll;

  warehouse: Warehouse;
  user: User;
  posItemPrices: PosItemPrice[] = [];

  searchValue = '';
  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private authenticationService: AuthenticationService,
    private warehousesService: WarehousesService,
    private posItemPricesServices: PosItemPricesService,
    private config: AppParamsConfig
  ) {}

  ngOnInit() {
    this.warehouse = new Warehouse();
    this.user = this.authenticationService.getUserFromLocalCache();

    this.warehousesService
      .getWarehouseByUserId(this.user.userId)
      .subscribe((res) => {
        this.warehouse.warehouseId = res.warehouseId;
        this.warehouse.warehouseName = res.warehouseName;

        this.getPosItemPrices(
          undefined,
          '',
          this.warehouse.warehouseId,
          this.pageNumber,
          this.config.pageSize
        );
      });
  }

  onWarehouseSearch() {}

  getPosItemPrices(
    event?,
    searchDesc?: string,
    warehouseId?: number,
    pageNumber?: number,
    pageSize?: number
  ) {
    this.isFetching = true;
    this.posItemPricesServices
      .getPosItemPrices(warehouseId, searchDesc, pageNumber, pageSize)
      .subscribe((res) => {
        res._embedded.posItemPrices.forEach(itm => {
          const tmpItem = new PosItemPrice();
          tmpItem.posItemPriceId = itm.posItemPriceId;
          tmpItem.item = itm.item;
          tmpItem.warehouse = itm.warehouse;
          tmpItem.defaultPrice = itm.defaultPrice;
          tmpItem.posItemPriceLevels = itm.posItemPriceLevels;
          this.posItemPrices = this.posItemPrices.concat(tmpItem);
        });
        console.log(this.posItemPrices);
        this.totalPages = res.page.totalPages;
        this.isFetching = false;
        if (event) {
          event.target.complete();
        }
      });
  }

  loadMoreData(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    this.getPosItemPrices(
      event,
      this.searchValue,
      this.warehouse.warehouseId,
      this.pageNumber,
      this.config.pageSize
    );
  }
}
