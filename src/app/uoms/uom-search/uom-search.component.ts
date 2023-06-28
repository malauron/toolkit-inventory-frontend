/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController, ViewDidEnter } from '@ionic/angular';
import { debounceTime, distinctUntilChanged, map, Subscription } from 'rxjs';
import { ItemUom } from 'src/app/classes/item-uom.model';
import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ItemsService } from 'src/app/services/items.service';

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
  itemUoms: ItemUom[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private modalController: ModalController,
    private config: AppParamsConfig,
    private itemsService: ItemsService
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
        this.itemUoms = [];
        this.pageNumber = 0;
        this.totalPages = 0;
        if (this.item) {
          this.getUoms(undefined, this.pageNumber,this.config.pageSize,this.item.itemId,this.searchValue);
        } else {
          this.getUoms(undefined, this.pageNumber,this.config.pageSize,this.item.itemId);
        }
      });

      if (this.item) {
        this.getUoms(undefined, this.pageNumber,this.config.pageSize,this.item.itemId);
      }
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
        this.item.itemId,
        this.searchValue
      );
    } else {
      this.getUoms(event, this.pageNumber, this.config.pageSize, this.item.itemId);
    }
  }

  getUoms(
    event?,
    pageNumber?: number,
    pageSize?: number,
    itemId?: number,
    uomName?: string
  ) {
    this.itemsService
      .getItemUomsByItemIdUomName(pageNumber, pageSize, itemId, uomName)
      .subscribe((res) => {
        this.itemUoms = this.itemUoms.concat(res._embedded.itemUoms);
      });
  }

  onSelectUom(itemUom?: ItemUom) {
    if (itemUom === undefined) {
      itemUom = new ItemUom();
      itemUom.uom = this.item.uom;
      itemUom.quantity = 1;
    }
    this.modalController.dismiss(itemUom, 'itemUom');
  }

  ngOnDestroy(): void {
    this.searchBarSub.unsubscribe();
  }

  dismissModal() {
    this.modalController.dismiss(null, 'dismissModal');
  }
}
