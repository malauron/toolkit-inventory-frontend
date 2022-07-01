/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar, ToastController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import {
  map,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import { Item } from '../classes/item.model';
import { ConfigParam } from '../ConfigParam';
import { ItemsService } from '../services/items.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit, OnDestroy {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('itemSearchBar', { static: true }) itemSearchBar: IonSearchbar;

  itemSearchBarSubscription: Subscription;
  itemSubcription: Subscription;

  itemLists: Item[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private itemService: ItemsService,
    private router: Router,
    private config: ConfigParam,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // Listen to user input for use in searching of items
    this.itemSearchBarSubscription = this.itemSearchBar.ionInput
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(2000),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        this.searchValue = res.trim();
        this.infiniteScroll.disabled = false;
        this.itemLists = [];
        this.pageNumber = 0;
        this.totalPages = 0;
        if (this.searchValue) {
          this.getItems(undefined, 0, this.config.pageSize, this.searchValue);
        } else {
          this.getItems(undefined, 0, this.config.pageSize);
        }
      });

    // Retrieves a new set of data from server
    // after adding or updating an item
    this.itemSubcription = this.itemService.item.subscribe((data) => {
      this.searchValue = '';
      this.infiniteScroll.disabled = false;
      this.itemLists = [];
      this.pageNumber = 0;
      this.totalPages = 0;
      this.getItems(undefined, 0, this.config.pageSize);
    });

    // Retrieves a partial list of items from the server
    // upon component initialization
    this.getItems(undefined, 0, this.config.pageSize);
  }

  getItems(event?, pageNumber?: number, pageSize?: number, itemName?: string) {
    this.isFetching = true;

    if (itemName === undefined) {
      this.itemService
        .getItems(pageNumber, pageSize)
        .subscribe(this.processResult(event), (error) => {
          this.messageBox('Unable to communicate with the server.');
        });
    } else {
      this.itemService
        .getItems(pageNumber, pageSize, itemName)
        .subscribe(this.processResult(event), (error) => {
          this.messageBox('Unable to communicate with the server.');
        });
    }
  }

  processResult(event?) {
    return (data) => {
      this.itemLists = this.itemLists.concat(data._embedded.items);
      this.totalPages = data.page.totalPages;
      this.isFetching = false;
      if (event) {
        event.target.complete();
      }
    };
  }

  loadMoreItems(event) {

    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      this.getItems(
        event,
        this.pageNumber,
        this.config.pageSize,
        this.searchValue
      );
    } else {
      this.getItems(event, this.pageNumber, this.config.pageSize);
    }
  }

  onAddItem() {
    this.router.navigate(['/', 'tabs', 'items', 'item-detail', 0]);
  }

  onEditItem(itemId: string) {
    this.router.navigate(['/', 'tabs', 'items', 'item-detail', itemId]);
  }

  ngOnDestroy(): void {
    this.itemSearchBarSubscription.unsubscribe();
    this.itemSubcription.unsubscribe();
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
}
