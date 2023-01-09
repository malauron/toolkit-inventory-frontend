/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { PosSale } from '../classes/pos-sale.model';
import { PosSalesService } from '../services/pos-sales.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})
export class SalesPage implements OnInit, OnDestroy {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('saleSearchBar', { static: true }) saleSearchBar: IonSearchbar;

  saleSearchSub: Subscription;
  saleSub: Subscription;

  sales: PosSale[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private salesService: PosSalesService,
    private router: Router,
    private config: AppParamsConfig,
    private toastController: ToastController,
  ) {}

  ngOnInit() {


    this.saleSearchSub = this.saleSearchBar.ionInput
    .pipe(
      map((event) => (event.target as HTMLInputElement).value),
      debounceTime(this.config.waitTime),
      distinctUntilChanged()
    )
    .subscribe((res) => {
      this.searchValue = res.trim();
      this.infiniteScroll.disabled = false;
      this.sales = [];
      this.pageNumber = 0;
      this.totalPages = 0;
      if (this.searchValue) {
        this.getSales(undefined, 0, this.config.pageSize, this.searchValue);
      } else {
        this.getSales(undefined, 0, this.config.pageSize);
      }
    });

    // Retrieves a new set of data from the server
    // after adding or updating
    this.saleSub = this.salesService.salesHaveChanged.subscribe((data) => {
      this.saleSearchBar.value = '';
      this.searchValue = '';
      this.infiniteScroll.disabled = false;
      this.sales = [];
      this.pageNumber = 0;
      this.totalPages = 0;
      this.getSales(undefined, 0, this.config.pageSize);
    });

    // Retrieves a partial list from the server
    // upon component initialization
    this.getSales(undefined, 0, this.config.pageSize);
  }

  getSales(
    event?,
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: string
  ) {
    this.isFetching = true;

    if (searchDesc === undefined) {
      searchDesc = '';
    }
    this.salesService
      .getSales(pageNumber, pageSize, searchDesc)
      .subscribe(this.processSaleResult(event), (error) => {
        this.messageBox('Unable to communicate with the server.');
      });
  }

  processSaleResult(event?) {
    return (data) => {
      this.sales = this.sales.concat(data._embedded.posSales);
      this.totalPages = data.page.totalPages;
      this.isFetching = false;
      if (event) {
        event.target.complete();
      }

      this.infiniteScroll.disabled = false;

    };
  }

  onAddSale() {
    this.router.navigate(['/', 'tabs', 'sales', 'sales-detail', 0]);
  }

  onEditSale(saleId: number) {
    this.router.navigate(['/','tabs','sales','sales-detail', saleId]);
  }

  getStatusColor(saleStatus): string {
    let statusColor: string;
    if (saleStatus === 'Unposted') {
      statusColor = 'warning';
    }
    if (saleStatus === 'Posted') {
      statusColor = 'success';
    }
    if (saleStatus === 'Cancelled') {
      statusColor = 'primary';
    }
    return statusColor;
  }

  loadMoreSales(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      this.getSales(
        event,
        this.pageNumber,
        this.config.pageSize,
        this.searchValue
      );
    } else {
      this.getSales(event, this.pageNumber, this.config.pageSize);
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
    this.saleSearchSub.unsubscribe();
    this.saleSub.unsubscribe();
  }

}
