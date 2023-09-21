/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { User } from 'src/app/Security/classes/user.model';
import { AuthenticationService } from 'src/app/Security/services/authentication.service';
import { WarehousesService } from 'src/app/services/warehouses.service';
import { ButcheryReceiving } from '../classes/butchery-receiving.model';
import { ButcheryReceivingsService } from '../services/butchery-receivings.service';

@Component({
  selector: 'app-receivings',
  templateUrl: './receivings.page.html',
  styleUrls: ['./receivings.page.scss'],
})
export class ReceivingsPage implements OnInit, OnDestroy {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('receivingSearchBar', { static: true })
  receivingSearchBar: IonSearchbar;

  receivingSearchSub: Subscription;
  receivingSub: Subscription;

  warehouse: Warehouse;
  user: User;
  receivings: ButcheryReceiving[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private receivingsService: ButcheryReceivingsService,
    private authenticationService: AuthenticationService,
    private warehousesService: WarehousesService,
    private router: Router,
    private config: AppParamsConfig,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.warehouse = new Warehouse();
    this.user = this.authenticationService.getUserFromLocalCache();

    this.warehousesService
      .getWarehouseByUserId(this.user.userId)
      .subscribe((resWarehouse) => {
        this.warehouse.warehouseId = resWarehouse.warehouseId;
        this.warehouse.warehouseName = resWarehouse.warehouseName;

        this.receivingSearchSub = this.receivingSearchBar.ionInput
          .pipe(
            map((event) => (event.target as HTMLInputElement).value),
            debounceTime(this.config.waitTime),
            distinctUntilChanged()
          )
          .subscribe((res) => {
            this.searchValue = res.trim();
            this.infiniteScroll.disabled = false;
            this.receivings = [];
            this.pageNumber = 0;
            this.totalPages = 0;
            if (this.searchValue) {
              this.getReceivings(
                undefined,
                0,
                this.config.pageSize,
                this.warehouse.warehouseId,
                this.searchValue
              );
            } else {
              this.getReceivings(
                undefined,
                0,
                this.config.pageSize,
                this.warehouse.warehouseId
              );
            }
          });

        // Retrieves a new set of data from the server
        // after adding or updating
        this.receivingSub =
          this.receivingsService.receivingsHaveChanged.subscribe((data) => {
            this.receivingSearchBar.value = '';
            this.searchValue = '';
            this.infiniteScroll.disabled = false;
            this.receivings = [];
            this.pageNumber = 0;
            this.totalPages = 0;
            this.getReceivings(
              undefined,
              0,
              this.config.pageSize,
              this.warehouse.warehouseId
            );
          });

        // Retrieves a partial list from the server
        // upon component initialization
        this.getReceivings(
          undefined,
          0,
          this.config.pageSize,
          this.warehouse.warehouseId
        );
      });
  }

  getReceivings(
    event?,
    pageNumber?: number,
    pageSize?: number,
    warehouseId?: number,
    searchDesc?: string
  ) {
    this.isFetching = true;

    if (searchDesc === undefined) {
      searchDesc = '';
    }
    this.receivingsService
      .getReceivings(pageNumber, pageSize, warehouseId, searchDesc)
      .subscribe(this.processReceivingResult(event), (error) => {
        this.messageBox('Unable to communicate with the server.');
      });
  }

  processReceivingResult(event?) {
    return (data) => {
      this.receivings = this.receivings.concat(
        data._embedded.butcheryReceivings
      );
      this.totalPages = data.page.totalPages;
      this.isFetching = false;
      if (event) {
        event.target.complete();
      }

      this.infiniteScroll.disabled = false;
    };
  }

  onAddReceiving() {
    this.router.navigate(['/', 'tabs', 'receivings', 'receiving-detail', 0]);
  }

  onEditReceiving(receivingId: number) {
    this.router.navigate([
      '/',
      'tabs',
      'receivings',
      'receiving-detail',
      receivingId,
    ]);
  }

  getStatusColor(receivingStatus): string {
    let statusColor: string;
    if (receivingStatus === 'Unposted') {
      statusColor = 'warning';
    }
    if (receivingStatus === 'Posted') {
      statusColor = 'success';
    }
    if (receivingStatus === 'Cancelled') {
      statusColor = 'primary';
    }
    return statusColor;
  }

  loadMoreReceivings(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      this.getReceivings(
        event,
        this.pageNumber,
        this.config.pageSize,
        this.warehouse.warehouseId,
        this.searchValue
      );
    } else {
      this.getReceivings(
        event,
        this.pageNumber,
        this.config.pageSize,
        this.warehouse.warehouseId
      );
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
    this.receivingSearchSub.unsubscribe();
    this.receivingSub.unsubscribe();
  }
}
