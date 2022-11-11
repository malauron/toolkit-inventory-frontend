/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController, ViewDidEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Item } from 'src/app/classes/item.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ItemsService } from 'src/app/services/items.service';
import { ButcheryReceivingItem } from '../../classes/butchery-receiving-item.model';
import { ButcheryReceivingsService } from '../../services/butchery-receivings.service';
import { ReceivingItemSearchService } from './receiving-item-search.service';

@Component({
  selector: 'app-receiving-item-search',
  templateUrl: './receiving-item-search.component.html',
  styleUrls: ['./receiving-item-search.component.scss'],
})
export class ReceivingItemSearchComponent
  implements OnInit, OnDestroy, ViewDidEnter
{
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('searchBar', { static: true }) searchBar: IonSearchbar;

  searchBarSub: Subscription;
  warehouseSub: Subscription;

  warehouse: Warehouse;

  receivedItemList: ButcheryReceivingItem[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private butcheryReceivingsService: ButcheryReceivingsService,
    private receivingItemSearchService: ReceivingItemSearchService,
    private config: AppParamsConfig,
    private modalController: ModalController
  ) {}

  ngOnDestroy(): void {
    this.warehouseSub.unsubscribe();
  }

  ngOnInit() {
    this.warehouseSub = this.receivingItemSearchService.warehouse.subscribe(
      (res) => {
        this.warehouse = res;
      }
    );

    this.searchBarSub = this.searchBar.ionInput
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(this.config.waitTime),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        this.searchValue = res.trim();
        this.infiniteScroll.disabled = false;
        this.receivedItemList = [];
        this.pageNumber = 0;
        this.totalPages = 0;
        this.getItems(undefined, 0, this.config.pageSize, this.searchValue);
      });

    this.getItems(undefined, 0, this.config.pageSize);
  }

  ionViewDidEnter(): void {
    setTimeout(() => {
      this.searchBar.setFocus();
    }, 5);
  }

  getItems(event?, pageNumber?: number, pageSize?: number, itemName?: string) {
    this.isFetching = true;

    this.butcheryReceivingsService
      .getReceivingItemsByWarehouse(
        this.warehouse.warehouseId,
        pageNumber,
        pageSize,
        itemName
      )
      .subscribe(this.processResult(event));
  }

  processResult(event?) {
    return (data) => {
      this.receivedItemList = this.receivedItemList.concat(
        data._embedded.butcheryReceivingItems
      );
      this.totalPages = data.page.totalPages;
      this.isFetching = false;
      if (event) {
        event.target.complete();
      }
    };
  }

  loadMoreItems(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      this.getItems(
        event,
        this.pageNumber,
        this.config.pageSize,
        this.searchValue
      );
    } else {
      this.getItems(event, this.pageNumber, this.config.pageSize);
    }
  }

  dismissModal() {
    this.modalController.dismiss(null, 'dismissModal');
  }

  onSelectItem(item: ButcheryReceivingItem) {
    this.modalController.dismiss(item, 'item');
  }
}
