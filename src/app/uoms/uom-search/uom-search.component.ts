import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController, ViewDidEnter } from '@ionic/angular';
import { debounceTime, distinctUntilChanged, map, Subscription } from 'rxjs';
import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';

@Component({
  selector: 'app-uom-search',
  templateUrl: './uom-search.component.html',
  styleUrls: ['./uom-search.component.scss'],
})
export class UomSearchComponent implements OnInit, OnDestroy, ViewDidEnter {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('searchBar', { static: true }) searchBar: IonSearchbar;

  searchBarSub: Subscription;

  item: Item;
  uoms: Uom[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private modalController: ModalController,
    private config: AppParamsConfig
  ) {}

  ngOnInit() {
    this.searchBarSub = this.searchBar.ionInput
    .pipe(
      map((event) => (event.target as HTMLInputElement).value),
      debounceTime(this.config.waitTime),
      distinctUntilChanged()
    )
    .subscribe((res) => {
      this.searchValue = res.trim();
      this.infiniteScroll.disabled = false;
      this.uoms = [];
      this.pageNumber = 0;
      this.totalPages = 0;
      if (this.item) {
        console.log('has item');
      } else {
        console.log('no item');
      }
    });
  }

  ionViewDidEnter(): void {
    setTimeout(() => {
      this.searchBar.setFocus();
    }, 5);
  }

  loadMoreItems(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      this.getUoms(
        event,
        this.pageNumber,
        this.config.pageSize,
        this.searchValue
      );
    } else {
      this.getUoms(event, this.pageNumber, this.config.pageSize);
    }
  }

  getUoms(event?, pageNumber?: number, pageSize?: number, uomName?: string) {}

  onSelectUom(uom: Uom) {
    this.modalController.dismiss(uom, 'uom');
  }

  ngOnDestroy(): void {
    this.searchBarSub.unsubscribe();
  }

  dismissModal() {
    this.modalController.dismiss(null, 'dismissModal');
  }
}
