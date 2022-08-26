/* eslint-disable no-underscore-dangle */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonFab, IonSearchbar, ToastController } from '@ionic/angular';
import { Purchase } from '../classes/purchase.model';
import { AppParamsConfig } from '../Configurations/app-params.config';
import { PurchasesService } from '../services/purchases.service';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.page.html',
  styleUrls: ['./purchases.page.scss'],
})
export class PurchasesPage implements OnInit {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('orderSearchBar', { static: true }) orderSearchBar: IonSearchbar;
  @ViewChild('purchaseListFab') purchaseListFab: IonFab;

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
      console.log(data._embedded.purchases);
      this.purchases = this.purchases.concat(data._embedded.purchases);
      this.totalPages = data.page.totalPages;
      this.isFetching = false;
      if (event) {
        event.target.complete();
      }
    };
  }

  onAddPurchase() {
    this.router.navigate(['/', 'tabs', 'purchases', 'purchase-detail', 0]);
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
}
