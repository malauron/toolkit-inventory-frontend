/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ButcheryProduction } from '../classes/butchery-production.model';
import { ButcheryProductionsService } from '../services/butchery-productions.service';

@Component({
  selector: 'app-productions',
  templateUrl: './productions.page.html',
  styleUrls: ['./productions.page.scss'],
})
export class ProductionsPage implements OnInit, OnDestroy {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('productionSearchBar', { static: true }) productionSearchBar: IonSearchbar;

  productionSearchSub: Subscription;
  productionSub: Subscription;

  productions: ButcheryProduction[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private productionsService: ButcheryProductionsService,
    private router: Router,
    private config: AppParamsConfig,
    private toastController: ToastController,
  ) {}

  ngOnInit() {


    this.productionSearchSub = this.productionSearchBar.ionInput
    .pipe(
      map((event) => (event.target as HTMLInputElement).value),
      debounceTime(this.config.waitTime),
      distinctUntilChanged()
    )
    .subscribe((res) => {
      this.searchValue = res.trim();
      this.infiniteScroll.disabled = false;
      this.productions = [];
      this.pageNumber = 0;
      this.totalPages = 0;
      if (this.searchValue) {
        this.getProductions(undefined, 0, this.config.pageSize, this.searchValue);
      } else {
        this.getProductions(undefined, 0, this.config.pageSize);
      }
    });

    // Retrieves a new set of data from the server
    // after adding or updating
    this.productionSub = this.productionsService.productionsHaveChanged.subscribe((data) => {
      this.searchValue = '';
      this.infiniteScroll.disabled = false;
      this.productions = [];
      this.pageNumber = 0;
      this.totalPages = 0;
      this.getProductions(undefined, 0, this.config.pageSize);
    });

    // Retrieves a partial list from the server
    // upon component initialization
    this.getProductions(undefined, 0, this.config.pageSize);
  }

  getProductions(
    event?,
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: string
  ) {
    this.isFetching = true;

    if (searchDesc === undefined) {
      searchDesc = '';
    }
    this.productionsService
      .getProductions(pageNumber, pageSize, searchDesc)
      .subscribe(this.processProductionResult(event), (error) => {
        this.messageBox('Unable to communicate with the server.');
      });
  }

  processProductionResult(event?) {
    return (data) => {

      this.productions = this.productions.concat(data._embedded.butcheryProductions);
      this.totalPages = data.page.totalPages;
      this.isFetching = false;
      if (event) {
        event.target.complete();
      }

      this.infiniteScroll.disabled = false;

    };
  }

  onAddProduction() {
    this.router.navigate(['/', 'tabs', 'productions', 'production-detail', 0]);
  }

  onEditProduction(productionId: number) {
    this.router.navigate(['/','tabs','productions','production-detail', productionId]);
  }

  getStatusColor(productionStatus): string {
    let statusColor: string;
    if (productionStatus === 'Unposted') {
      statusColor = 'warning';
    }
    if (productionStatus === 'Posted') {
      statusColor = 'success';
    }
    if (productionStatus === 'Cancelled') {
      statusColor = 'primary';
    }
    return statusColor;
  }

  loadMoreProductions(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      this.getProductions(
        event,
        this.pageNumber,
        this.config.pageSize,
        this.searchValue
      );
    } else {
      this.getProductions(event, this.pageNumber, this.config.pageSize);
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
    this.productionSearchSub.unsubscribe();
    this.productionSub.unsubscribe();
  }

}
