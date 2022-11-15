/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController, ViewDidEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Vendor } from 'src/app/classes/vendor.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { VendorsService } from 'src/app/services/vendors.service';

@Component({
  selector: 'app-vendor-search',
  templateUrl: './vendor-search.component.html',
  styleUrls: ['./vendor-search.component.scss'],
})
export class VendorSearchComponent  implements OnInit, OnDestroy, ViewDidEnter {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('vendorSearchBar', {static: true}) vendorSearchBar: IonSearchbar;

  vendorSearchBarSubscription: Subscription;

  vendorList: Vendor[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private vendorService: VendorsService,
    private config: AppParamsConfig,
    private modalController: ModalController
  ) { }

  ngOnDestroy(): void {
    this.vendorSearchBarSubscription.unsubscribe();
  }

  ngOnInit() {
    this.vendorSearchBarSubscription = this.vendorSearchBar.ionInput
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(this.config.waitTime),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        this.searchValue = res.trim();
        this.infiniteScroll.disabled = false;
        this.vendorList = [];
        this.pageNumber = 0;
        this.totalPages = 0;
        if (this.searchValue) {
          this.getVendors(undefined, 0, this.config.pageSize, this.searchValue);
        } else {
          this.getVendors(undefined, 0, this.config.pageSize);
        }
      });
  }

  ionViewDidEnter(): void {
      setTimeout(() => {
        this.vendorSearchBar.setFocus();
      }, 5);
  }

  getVendors(
    event?,
    pageNumber?: number,
    pageSize?: number,
    vendorName?: string
  ) {
    this.isFetching = true;

    if (vendorName === undefined) {
      this.vendorService
        .getVendors(pageNumber, pageSize)
        .subscribe(this.procressResult(event), (error) => {
          this.isFetching = false;
        });
    } else {
      this.vendorService
        .getVendors(pageNumber, pageSize, vendorName)
        .subscribe(this.procressResult(event), (error) => {
          this.isFetching = false;
        });
    }
  }

  procressResult(event?) {
    return(data) => {
      this.vendorList = this.vendorList.concat(data._embedded.vendors);
      this.totalPages = data.page.totalPages;
      this.isFetching = false;
      if (event) {
        event.target.complete();
      }
    };
  }

  loadMoreVendors(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      this.getVendors(
        event,
        this.pageNumber,
        this.config.pageSize,
        this.searchValue
      );
    } else {
      this.getVendors(event, this.pageNumber, this.config.pageSize);
    }
  }

  dismissModal() {
    this.modalController.dismiss(null, 'dismissModal');
  }

  onSelectVendor(vendor: Vendor) {
    this.modalController.dismiss(vendor, 'vendor');
  }
}
