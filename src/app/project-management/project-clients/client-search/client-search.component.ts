import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { debounceTime, distinctUntilChanged, map, Subscription } from 'rxjs';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ProjectClient } from '../../classes/project-client.model';
import { ProjectClientsService } from '../../services/project-clients.service';

@Component({
  selector: 'app-client-search',
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.scss'],
})
export class ClientSearchComponent implements OnInit, OnDestroy {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('searchBar', { static: true }) searchBar: IonSearchbar;

  searchBarSub: Subscription;

  clientList: ProjectClient[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private clientsService: ProjectClientsService,
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
          this.clientList = [];
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
      this.clientsService
        .getClients(pageNumber, pageSize)
        .subscribe({
          next: this.processResult(event),
          error: () => { this.isFetching = false}
        });
    } else {
      this.clientsService
        .getClients(pageNumber, pageSize, searchDesc)
        .subscribe({
          next: this.processResult(event),
          error: () => { this.isFetching = false }
        });
    }
  }

  processResult(event) {
    return(data) => {
      this.clientList = this.clientList.concat(data._embedded.projectClients);
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

  onSelectClient(client: ProjectClient) {
    this.modalCtrl.dismiss(client, 'client');
  }

  dismissModal() {
    this.modalCtrl.dismiss(null, 'dismissModal');
  }

  ngOnDestroy(): void {
    this.searchBarSub.unsubscribe();
  }

}
