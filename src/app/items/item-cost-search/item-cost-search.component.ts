/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController, ViewDidEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ItemCost } from 'src/app/classes/item-cost.model';
import { Item } from 'src/app/classes/item.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-item-cost-search',
  templateUrl: './item-cost-search.component.html',
  styleUrls: ['./item-cost-search.component.scss'],
})
export class ItemCostSearchComponent implements OnInit, OnDestroy, ViewDidEnter {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('itemSearchBar', { static: true }) itemSearchBar: IonSearchbar;

  itemSearchBarSubscription: Subscription;

  itemCostList: ItemCost[] = [];
  warehouse: Warehouse;

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private itemService: ItemsService,
    private config: AppParamsConfig,
    private modalController: ModalController
  ) {}

  ngOnDestroy(): void {
    this.itemSearchBarSubscription.unsubscribe();
  }

  ngOnInit() {
    this.itemSearchBarSubscription = this.itemSearchBar.ionInput
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(this.config.waitTime),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        this.searchValue = res.trim();
        this.infiniteScroll.disabled = false;
        this.itemCostList = [];
        this.pageNumber = 0;
        this.totalPages = 0;
        if (this.searchValue) {
          this.getItems(undefined, 0, this.config.pageSize, this.searchValue);
        } else {
          this.getItems(undefined, 0, this.config.pageSize);
        }
      });
  }

  ionViewDidEnter(): void {
    setTimeout(() => {
      this.itemSearchBar.setFocus();
    }, 5);
  }

  getItems(event?, pageNumber?: number, pageSize?: number, itemName?: string) {
    this.isFetching = true;
      this.itemService
        .getItemCostsByPage(itemName, this.warehouse.warehouseId, pageNumber, pageSize)
        .subscribe({
          next: this.processResult(event),
          error: (error) => {
          this.isFetching = false;}
        });
  }

  processResult(event?) {
    return (data) => {
      this.itemCostList = this.itemCostList.concat(data._embedded.itemCosts);
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

  onSelectItem(item: Item) {
    this.modalController.dismiss(item, 'item');
  }
}
