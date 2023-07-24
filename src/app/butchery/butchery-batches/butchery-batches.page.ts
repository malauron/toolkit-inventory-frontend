/* eslint-disable no-underscore-dangle */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar, ToastController } from '@ionic/angular';
import { debounceTime, distinctUntilChanged, map, Subscription } from 'rxjs';
import { ButcheryBatch } from '../classes/butchery-batch.model';
import { ButcheryBatchesService } from '../services/butchery-batches.service';

@Component({
  selector: 'app-batches',
  templateUrl: './butchery-batches.page.html',
  styleUrls: ['./butchery-batches.page.scss'],
})
export class ButcheryBatchesPage implements OnInit {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('searchBar', { static: true }) searchBar: IonSearchbar;

  searchBarSub: Subscription;
  batchSub: Subscription;

  batches: ButcheryBatch[] = [];

  searchValue = '';

  pageSize = 20;
  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private butcheryBatchersService: ButcheryBatchesService
  ) {}

  ngOnInit() {
    this.searchBarSub = this.searchBar.ionInput
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        this.searchValue = res.trim();
        this.infiniteScroll.disabled = false;
        this.batches = [];
        this.pageNumber = 0;
        this.totalPages = 0;
        this.getBatches(
          undefined,
          this.pageNumber,
          this.pageSize,
          this.searchValue
        );
      });

    this.getBatches(undefined, 0, this.pageSize);

  }

  getBatches(
    event?,
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: string
  ) {
    this.isFetching = true;

    this.butcheryBatchersService
      .getButcheryBatches(pageNumber, pageSize, searchDesc)
      .subscribe({
        next: (res) => {
          this.batches = this.batches.concat(res._embedded.butcheryBatches);
          this.totalPages = res.page.totalPages;
        },
        error: () => {
          this.isFetching = false;
          if (event) {
            event.target.complete();
          }
          this.infiniteScroll.disabled = false;
        },
        complete: () => {
          this.isFetching = false;
          if (event) {
            event.target.complete();
          }
          this.infiniteScroll.disabled = false;
        },
      });
  }

  onAddBatch() {
    this.router.navigate([
      '/',
      'tabs',
      'butchery-batches',
      'butchery-batch',
      0,
    ]);
  }

  onEditBatch(batchId: number) {
    this.router.navigate([
      '/',
      'tabs',
      'butchery-batches',
      'butchery-batch',
      batchId
    ]);
  }

  loadMoreItems(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      this.getBatches(
        event,
        this.pageNumber,
        this.pageSize,
        this.searchValue
      );
    } else {
      this.getBatches(event, this.pageNumber, this.pageSize);
    }
  }

  async messageBox(messageDescription: string) {
    const toast = await this.toastCtrl.create({
      color: 'dark',
      duration: 2000,
      position: 'top',
      message: messageDescription,
    });

    await toast.present();
  }
}
