/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController, ViewDidEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ButcheryBatchesService } from '../../services/butchery-batches.service';
import { ButcheryBatch } from '../../classes/butchery-batch.model';
import { Item } from 'src/app/classes/item.model';

@Component({
  selector: 'app-butchery-batch-inventory-item-search',
  templateUrl: './butchery-batch-inventory-item-search.component.html',
  styleUrls: ['./butchery-batch-inventory-item-search.component.scss'],
})
export class ButcheryBatchInventoryItemSearchComponent implements OnInit, OnDestroy {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('itemSearchBar', { static: true }) itemSearchBar: IonSearchbar;

  itemSearchBarSubscription: Subscription;

  itemList: Item[] = [];

  searchValue = '';

  batchId = 0;
  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private butcheryBatchService: ButcheryBatchesService,
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
        this.itemList = [];
        this.pageNumber = 0;
        this.totalPages = 0;
        if (this.searchValue) {
          this.getBatchItems(undefined, 0, this.config.pageSize, this.searchValue);
        } else {
          this.getBatchItems(undefined, 0, this.config.pageSize);
        }
      });
  }

  ionViewDidEnter(): void {
    setTimeout(() => {
      this.itemSearchBar.setFocus();
    }, 5);
  }

  getBatchItems(
    event?,
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: string
  ) {
    this.isFetching = true;
    if (searchDesc === undefined) {
      this.butcheryBatchService
        .getButcheryBatchInventoriesByBatchId(pageNumber, pageSize, this.batchId, undefined)
        .subscribe({
          next: this.procressResult(event),
          error: (error) => {
            this.isFetching = false;
          },
        });
    } else {
      this.butcheryBatchService
        .getButcheryBatchInventoriesByBatchId(pageNumber, pageSize, this.batchId, searchDesc)
        .subscribe({
          next: this.procressResult(event),
          error: (error) => {
            this.isFetching = false;
          },
        });
    }
  }

  procressResult(event?) {
    return (data) => {
      this.itemList = this.itemList.concat(data._embedded.items);
      this.totalPages = data.page.totalPages;
      this.isFetching = false;
      if (event) {
        event.target.complete();
      }
    };
  }

  loadMore(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      this.getBatchItems(
        event,
        this.pageNumber,
        this.config.pageSize,
        this.searchValue
      );
    } else {
      this.getBatchItems(event, this.pageNumber, this.config.pageSize);
    }
  }

  dismissModal() {
    this.modalController.dismiss(null, 'dismissModal');
  }

  onSelectBatch(batch: ButcheryBatch) {
    this.modalController.dismiss(batch, 'item');
  }
}
