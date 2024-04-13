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

          } else {

          }
        },
      });
  }

  ngOnDestroy(): void {
    this.searchBarSub.unsubscribe();
  }

}
