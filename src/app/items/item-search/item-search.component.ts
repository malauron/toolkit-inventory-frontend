/* eslint-disable no-underscore-dangle */
import {
  AfterContentChecked,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonSearchbar, ModalController, ViewDidEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Item } from 'src/app/classes/item.model';
import { ConfigParam } from 'src/app/ConfigParam';
import { ItemsService } from 'src/app/services/items.service';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.scss'],
})
export class ItemSearchComponent implements OnInit,ViewDidEnter, AfterContentChecked {
  @ViewChild('swiper') swiper: SwiperComponent;
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('itemSearchBar', { static: true }) itemSearchBar: IonSearchbar;

  itemSearchBarSubscription: Subscription;

  itemList: Item[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private itemService: ItemsService,
    private config: ConfigParam,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.itemSearchBarSubscription = this.itemSearchBar.ionInput
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(2000),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        this.searchValue = res.trim();
        this.infiniteScroll.disabled = false;
        this.itemList = [];
        this.pageNumber = 0;
        this.totalPages = 0;
        if (this.searchValue) {
          this.getItems(undefined, 0, this.config.pageSize, this.searchValue);
        } else {
          this.getItems(undefined, 0, this.config.pageSize);
        }
      });
  }

  ionViewDidEnter(): void {
    setTimeout(() => {
      this.itemSearchBar.setFocus();
    }, 5);
  }

  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
    // Listen to user input for use in searching of items
  }

  getItems(event?, pageNumber?: number, pageSize?: number, itemName?: string) {
    this.isFetching = true;

    if (itemName === undefined) {
      this.itemService
        .getItems(pageNumber, pageSize)
        .subscribe(this.processResult(event), (error) => {
          // this.messageBox('Unable to communicate with the server.');
          this.isFetching = false;
        });
    } else {
      this.itemService
        .getItems(pageNumber, pageSize, itemName)
        .subscribe(this.processResult(event), (error) => {
          // this.messageBox('Unable to communicate with the server.');
          this.isFetching = false;
        });
    }
  }

  processResult(event?) {
    return (data) => {
      this.itemList = this.itemList.concat(data._embedded.items);
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

   onSwiper([swiper]) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }

  dismissModal() {
    this.modalController.dismiss(null,'dismissModal');
  }

  onSelectItem(item: Item) {
    this.modalController.dismiss(item, 'item');
  }
}
