/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ButcheryReleasing } from '../classes/butchery-releasing.model';
import { ButcheryReleasingsService } from '../services/butchery-releasings.service';

@Component({
  selector: 'app-releasings',
  templateUrl: './releasings.page.html',
  styleUrls: ['./releasings.page.scss'],
})

export class ReleasingsPage implements OnInit, OnDestroy {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('releasingSearchBar', { static: true }) releasingSearchBar: IonSearchbar;

  releasingSearchSub: Subscription;
  releasingSub: Subscription;

  releasings: ButcheryReleasing[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private releasingsService: ButcheryReleasingsService,
    private router: Router,
    private config: AppParamsConfig,
    private toastController: ToastController,
  ) {}

  ngOnInit() {


    this.releasingSearchSub = this.releasingSearchBar.ionInput
    .pipe(
      map((event) => (event.target as HTMLInputElement).value),
      debounceTime(this.config.waitTime),
      distinctUntilChanged()
    )
    .subscribe((res) => {
      this.searchValue = res.trim();
      this.infiniteScroll.disabled = false;
      this.releasings = [];
      this.pageNumber = 0;
      this.totalPages = 0;
      if (this.searchValue) {
        this.getReleasings(undefined, 0, this.config.pageSize, this.searchValue);
      } else {
        this.getReleasings(undefined, 0, this.config.pageSize);
      }
    });

    // Retrieves a new set of data from the server
    // after adding or updating
    this.releasingSub = this.releasingsService.releasingsHaveChanged.subscribe((data) => {
      this.releasingSearchBar.value = '';
      this.searchValue = '';
      this.infiniteScroll.disabled = false;
      this.releasings = [];
      this.pageNumber = 0;
      this.totalPages = 0;
      this.getReleasings(undefined, 0, this.config.pageSize);
    });

    // Retrieves a partial list from the server
    // upon component initialization
    this.getReleasings(undefined, 0, this.config.pageSize);
  }

  getReleasings(
    event?,
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: string
  ) {
    this.isFetching = true;

    if (searchDesc === undefined) {
      searchDesc = '';
    }
    this.releasingsService
      .getReleasings(pageNumber, pageSize, searchDesc)
      .subscribe(this.processReleasingResult(event), (error) => {
        this.messageBox('Unable to communicate with the server.');
      });
  }

  processReleasingResult(event?) {
    return (data) => {
      this.releasings = this.releasings.concat(data._embedded.butcheryReleasings);
      this.totalPages = data.page.totalPages;
      this.isFetching = false;
      if (event) {
        event.target.complete();
      }

      this.infiniteScroll.disabled = false;

    };
  }

  onAddReleasing() {
    this.router.navigate(['/', 'tabs', 'releasings', 'releasing-detail', 0]);
  }

  onEditReleasing(releasingId: number) {
    this.router.navigate(['/','tabs','releasings','releasing-detail', releasingId]);
  }

  getStatusColor(releasingStatus): string {
    let statusColor: string;
    if (releasingStatus === 'Unposted') {
      statusColor = 'warning';
    }
    if (releasingStatus === 'Posted') {
      statusColor = 'success';
    }
    if (releasingStatus === 'Cancelled') {
      statusColor = 'primary';
    }
    return statusColor;
  }

  loadMoreReleasings(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      this.getReleasings(
        event,
        this.pageNumber,
        this.config.pageSize,
        this.searchValue
      );
    } else {
      this.getReleasings(event, this.pageNumber, this.config.pageSize);
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
    this.releasingSearchSub.unsubscribe();
    this.releasingSub.unsubscribe();
  }

}
