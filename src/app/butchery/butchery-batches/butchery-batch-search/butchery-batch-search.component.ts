/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController, ViewDidEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ButcheryBatchesService } from '../../services/butchery-batches.service';
import { ButcheryBatch } from '../../classes/butchery-batch.model';

@Component({
  selector: 'app-butchery-batch-search',
  templateUrl: './butchery-batch-search.component.html',
  styleUrls: ['./butchery-batch-search.component.scss'],
})
export class ButcheryBatchSearchComponent
  implements OnInit, OnDestroy, ViewDidEnter
{
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('batchSearchBar', { static: true }) batchSearchBar: IonSearchbar;

  batchSearchBarSubscription: Subscription;

  batchList: ButcheryBatch[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private butcheryBatchService: ButcheryBatchesService,
    private config: AppParamsConfig,
    private modalController: ModalController
  ) {}

  ngOnDestroy(): void {
    this.batchSearchBarSubscription.unsubscribe();
  }

  ngOnInit() {
    this.batchSearchBarSubscription = this.batchSearchBar.ionInput
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(this.config.waitTime),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        this.searchValue = res.trim();
        this.infiniteScroll.disabled = false;
        this.batchList = [];
        this.pageNumber = 0;
        this.totalPages = 0;
        if (this.searchValue) {
          this.getBatches(undefined, 0, this.config.pageSize, this.searchValue);
        } else {
          this.getBatches(undefined, 0, this.config.pageSize);
        }
      });
  }

  ionViewDidEnter(): void {
    setTimeout(() => {
      this.batchSearchBar.setFocus();
    }, 5);
  }

  getBatches(
    event?,
    pageNumber?: number,
    pageSize?: number,
    warehouseName?: string
  ) {
    this.isFetching = true;

    if (warehouseName === undefined) {
      this.butcheryBatchService
        .getButcheryBatches(pageNumber, pageSize)
        .subscribe({
          next: this.procressResult(event),
          error: (error) => {
            this.isFetching = false;
          },
        });
    } else {
      this.butcheryBatchService
        .getButcheryBatches(pageNumber, pageSize, warehouseName)
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
      this.batchList = this.batchList.concat(data._embedded.butcheryBatches);
      this.totalPages = data.page.totalPages;
      this.isFetching = false;
      if (event) {
        event.target.complete();
      }
    };
  }

  loadMoreWarehouses(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      this.getBatches(
        event,
        this.pageNumber,
        this.config.pageSize,
        this.searchValue
      );
    } else {
      this.getBatches(event, this.pageNumber, this.config.pageSize);
    }
  }

  dismissModal() {
    this.modalController.dismiss(null, 'dismissModal');
  }

  onSelectBatch(batch: ButcheryBatch) {
    this.modalController.dismiss(batch, 'butcherybatch');
  }
}
