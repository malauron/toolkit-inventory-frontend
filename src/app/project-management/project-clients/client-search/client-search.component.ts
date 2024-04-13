import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
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
  @ViewChild('clientSearchBar', { static: true }) clientSearchBar: IonSearchbar;

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

  ngOnInit() {}

  ngOnDestroy(): void {
    this.searchBarSub.unsubscribe();
  }

}
