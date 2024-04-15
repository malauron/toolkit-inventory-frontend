import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { debounceTime, distinctUntilChanged, map, Subscription } from 'rxjs';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ProjectBrokerage } from '../../classes/project-brokerage.model';
import { ProjectBrokeragesService } from '../../services/project-brokerages.service';

@Component({
  selector: 'app-brokerage-search',
  templateUrl: './brokerage-search.component.html',
  styleUrls: ['./brokerage-search.component.scss'],
})
export class BrokerageSearchComponent implements OnInit, OnDestroy {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('searchBar', { static: true }) searchBar: IonSearchbar;

  searchBarSub: Subscription;

  brokerageList: ProjectBrokerage[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private brokeragesService: ProjectBrokeragesService,
    private config: AppParamsConfig,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.searchBarSub = this.searchBar.ionInput
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(this.config.waitTime),
        distinctUntilChanged()
      ).subscribe({
        next: (res) => {
          this.searchValue = res.trim();
          this.infiniteScroll.disabled = false;
          this.brokerageList = [];
          this.pageNumber = 0;
          this.totalPages = 0;
          if (this.searchValue) {
            this.getData(undefined, 0, this.config.pageSize, this.searchValue);
          } else {
            this.getData(undefined, 0, this.config.pageSize);
          }
        },
      });
  }

  ionViewDidEnter(): void {
      setTimeout(() => {
        this.searchBar.setFocus();
      }, 5);
  }

  getData(
    event?,
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: string,
  ) {
    this.isFetching = true;

    if (searchDesc === undefined) {
      this.brokeragesService
        .getBrokerages(pageNumber, pageSize)
        .subscribe({
          next: this.processResult(event),
          error: () => { this.isFetching = false}
        });
    } else {
      this.brokeragesService
        .getBrokerages(pageNumber, pageSize, searchDesc)
        .subscribe({
          next: this.processResult(event),
          error: () => { this.isFetching = false }
        });
    }
  }

  processResult(event) {
    return(data) => {
      this.brokerageList = this.brokerageList.concat(data._embedded.projectBrokerages);
      this.totalPages = data.page.totalPages;
      this.isFetching = false;
      if (event) {
        event.target.complete();
      }
    };
  }

  loadMoreCata(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      this.getData(
        event,
        this.pageNumber,
        this.config.pageSize,
        this.searchValue
      );
    } else {
      this.getData(event, this.pageNumber, this.config.pageSize);
    }
  }

  onSelect(brokerage: ProjectBrokerage) {
    this.modalCtrl.dismiss(brokerage, 'brokerage');
  }

  dismissModal() {
    this.modalCtrl.dismiss(null, 'dismissModal');
  }

  ngOnDestroy(): void {
    this.searchBarSub.unsubscribe();
  }

}
