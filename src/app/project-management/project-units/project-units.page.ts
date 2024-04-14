/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar, ToastController } from '@ionic/angular';
import { debounceTime, distinctUntilChanged, map, Subscription } from 'rxjs';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ProjectUnit } from '../classes/project-unit.model';
import { UnitStatus } from '../classes/unit-status.model';
import { ProjectUnitsService } from '../services/project-units.service';

@Component({
  selector: 'app-project-units',
  templateUrl: './project-units.page.html',
  styleUrls: ['./project-units.page.scss'],
})

export class ProjectUnitsPage implements OnInit, OnDestroy {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('unitSearchBar', { static: true }) unitSearchBar: IonSearchbar;

  unitSearchSub: Subscription;
  unitSub: Subscription;
  unitStatus = UnitStatus;

  units: ProjectUnit[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private unitsService: ProjectUnitsService,
    private router: Router,
    private config: AppParamsConfig,
    private toastController: ToastController,
  ) {}

  ngOnInit() {


    this.unitSearchSub = this.unitSearchBar.ionInput
    .pipe(
      map((event) => (event.target as HTMLInputElement).value),
      debounceTime(this.config.waitTime),
      distinctUntilChanged()
    )
    .subscribe((res) => {
      this.searchValue = res.trim();
      this.infiniteScroll.disabled = false;
      this.units = [];
      this.pageNumber = 0;
      this.totalPages = 0;
      if (this.searchValue) {
        this.getUnits(undefined, 0, this.config.pageSize, this.searchValue);
      } else {
        this.getUnits(undefined, 0, this.config.pageSize);
      }
    });

    // Retrieves a new set of data from the server
    // after adding or updating
    this.unitSub = this.unitsService.unitsHaveChanged.subscribe((data) => {
      this.unitSearchBar.value = '';
      this.searchValue = '';
      this.infiniteScroll.disabled = false;
      this.units = [];
      this.pageNumber = 0;
      this.totalPages = 0;
      this.getUnits(undefined, 0, this.config.pageSize);
    });

    // Retrieves a partial list from the server
    // upon component initialization
    this.getUnits(undefined, 0, this.config.pageSize);
  }

  getUnits(
    event?,
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: string
  ) {
    this.isFetching = true;

    if (searchDesc === undefined) {
      searchDesc = '';
    }
    this.unitsService
      .getUnits(pageNumber, pageSize, searchDesc)
      .subscribe(this.processUnitResult(event), (error) => {
        this.messageBox('Unable to communicate with the server.');
      });
  }

  processUnitResult(event?) {
    return (data) => {
      this.units = this.units.concat(data._embedded.projectUnits);
      this.totalPages = data.page.totalPages;
      this.isFetching = false;
      if (event) {
        event.target.complete();
      }

      this.infiniteScroll.disabled = false;

    };
  }

  onAddUnit() {
    this.router.navigate(['/', 'tabs', 'project-units', 'project-unit-detail', 0]);
  }

  onEditUnit(unitId: number) {
    this.router.navigate(['/','tabs','project-units','project-unit-detail', unitId]);
  }

  getStatusColor(unitStatus): string {
    let statusColor: string;
    if (unitStatus === 'Unposted') {
      statusColor = 'warning';
    }
    if (unitStatus === 'Posted') {
      statusColor = 'success';
    }
    if (unitStatus === 'Cancelled') {
      statusColor = 'primary';
    }
    return statusColor;
  }

  loadMoreUnits(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      this.getUnits(
        event,
        this.pageNumber,
        this.config.pageSize,
        this.searchValue
      );
    } else {
      this.getUnits(event, this.pageNumber, this.config.pageSize);
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
    this.unitSearchSub.unsubscribe();
    this.unitSub.unsubscribe();
  }

}
