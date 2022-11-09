/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonSearchbar, ModalController, ViewDidEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Item } from 'src/app/classes/item.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ItemsService } from 'src/app/services/items.service';
import { ButcheryReceivingsService } from '../../services/butchery-receivings.service';
import { ReceivingItemSearchService } from './receiving-item-search.service';

@Component({
  selector: 'app-receiving-item-search',
  templateUrl: './receiving-item-search.component.html',
  styleUrls: ['./receiving-item-search.component.scss'],
})
export class ReceivingItemSearchComponent implements OnInit, OnDestroy,ViewDidEnter {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('itemSearchBar', { static: true }) itemSearchBar: IonSearchbar;

  itemSearchBarSubscription: Subscription;
  warehouseSub: Subscription;

  itemList: Item[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private itemService: ButcheryReceivingsService,
    private receivingItemSearchService: ReceivingItemSearchService,
    private config: AppParamsConfig,
    private modalController: ModalController
  ) {}

  ngOnDestroy(): void {
    this.warehouseSub.unsubscribe();
  }

  ngOnInit() {

    this.warehouseSub = this.receivingItemSearchService.warehouse.subscribe(res => {
      console.log(res);
    });
    this.itemSearchBarSubscription = this.itemSearchBar.ionInput
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(this.config.waitTime),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        this.searchValue = res.trim();
        this.infiniteScroll.disabled = false;
        this.itemList = [];
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

    // if (itemName === undefined) {
    //   this.itemService
    //     .getItems(pageNumber, pageSize)
    //     .subscribe(this.processResult(event), (error) => {
    //       // this.messageBox('Unable to communicate with the server.');
    //       this.isFetching = false;
    //     });
    // } else {
    //   this.itemService
    //     .getItems(pageNumber, pageSize, itemName)
    //     .subscribe(this.processResult(event), (error) => {
    //       // this.messageBox('Unable to communicate with the server.');
    //       this.isFetching = false;
    //     });
    // }
  }

  processResult(event?) {
    return (data) => {
      this.itemList = this.itemList.concat(data._embedded.items);
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
    this.modalController.dismiss(null,'dismissModal');
  }

  onSelectItem(item: Item) {
    this.modalController.dismiss(item, 'item');
  }
}
