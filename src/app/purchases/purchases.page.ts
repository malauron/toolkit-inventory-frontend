/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonFab, IonSearchbar, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Purchase } from '../classes/purchase.model';
import { AppParamsConfig } from '../Configurations/app-params.config';
import { PurchasesService } from '../services/purchases.service';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.page.html',
  styleUrls: ['./purchases.page.scss'],
})
export class PurchasesPage implements OnInit, OnDestroy {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('purchaseSearchBar', { static: true }) purchaseSearchBar: IonSearchbar;

  purchaseSearchBarSub: Subscription;
  purchaseSub: Subscription;

  purchases: Purchase[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private purchaseService: PurchasesService,
    private router: Router,
    private config: AppParamsConfig,
    private toastController: ToastController,
  ) {}

  ngOnInit() {


    this.purchaseSearchBarSub = this.purchaseSearchBar.ionInput
    .pipe(
      map((event) => (event.target as HTMLInputElement).value),
      debounceTime(this.config.waitTime),
      distinctUntilChanged()
    )
    .subscribe((res) => {
      this.searchValue = res.trim();
      this.infiniteScroll.disabled = false;
      this.purchases = [];
      this.pageNumber = 0;
      this.totalPages = 0;
      if (this.searchValue) {
        this.getPurchases(undefined, 0, this.config.pageSize, this.searchValue);
      } else {
        this.getPurchases(undefined, 0, this.config.pageSize);
      }
    });

    // Retrieves a new set of data from the server
    // after adding or updating
    this.purchaseSub = this.purchaseService.purchasesHaveChanged.subscribe((data) => {
      this.searchValue = '';
      this.infiniteScroll.disabled = false;
      this.purchases = [];
      this.pageNumber = 0;
      this.totalPages = 0;
      this.getPurchases(undefined, 0, this.config.pageSize);
    });

    // Retrieves a partial list from the server
    // upon component initialization
    this.getPurchases(undefined, 0, this.config.pageSize);
  }

  getPurchases(
    event?,
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: string
  ) {
    this.isFetching = true;

    if (searchDesc === undefined) {
      searchDesc = '';
    }
    this.purchaseService
      .getPurchases(pageNumber, pageSize, searchDesc)
      .subscribe(this.processPurchaseResult(event), (error) => {
        this.messageBox('Unable to communicate with the server.');
      });
  }

  processPurchaseResult(event?) {
    return (data) => {

      this.purchases = this.purchases.concat(data._embedded.purchases);
      this.totalPages = data.page.totalPages;
      this.isFetching = false;
      if (event) {
        event.target.complete();
      }

      this.infiniteScroll.disabled = false;

    };
  }

  onAddPurchase() {
    this.router.navigate(['/', 'tabs', 'purchases', 'purchase-detail', 0]);
  }

  onEditPurchase(purchaseId: number) {
    this.router.navigate(['/','tabs','purchases','purchase-detail', purchaseId]);
  }

  getStatusColor(purchaseStatus): string {
    let statusColor: string;
    if (purchaseStatus === 'Unposted') {
      statusColor = 'warning';
    }
    if (purchaseStatus === 'Posted') {
      statusColor = 'success';
    }
    if (purchaseStatus === 'Cancelled') {
      statusColor = 'primary';
    }
    return statusColor;
  }

  loadMorePurchases(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      this.getPurchases(
        event,
        this.pageNumber,
        this.config.pageSize,
        this.searchValue
      );
    } else {
      this.getPurchases(event, this.pageNumber, this.config.pageSize);
    }
  }

  async messageBox(messageDescription: string) {
    const toast = await this.toastController.create({
      color: 'dark',
      duration: 2000,
      position: 'top',
      message: messageDescription,
    });
    await toast.present();
  }

  ngOnDestroy(): void {
    this.purchaseSearchBarSub.unsubscribe();
    this.purchaseSub.unsubscribe();
  }

}
