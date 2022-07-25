/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Menu } from '../classes/menu.model';
import { ConfigParam } from '../ConfigParam';
import { CartsService } from '../services/carts.service';
import { MenusService } from '../services/menus.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit, OnDestroy {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('menuSearchBar', { static: true }) menuSearchBar: IonSearchbar;

  menuSearchBarSub: Subscription;
  menuSub: Subscription;

  menuList: Menu[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private menusService: MenusService,
    private router: Router,
    private config: ConfigParam,
    private toastController: ToastController,
    private cartService: CartsService
  ) {}

  ngOnInit() {
    this.menuSearchBarSub = this.menuSearchBar.ionInput
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(2000),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        this.searchValue = res.trim();
        this.infiniteScroll.disabled = false;
        this.menuList = [];
        this.pageNumber = 0;
        this.totalPages = 0;
        if (this.searchValue) {
          this.getMenus(undefined, 0, this.config.pageSize, this.searchValue);
        } else {
          this.getMenus(undefined, 0, this.config.pageSize);
        }
      });

    // Retrieves a new set of data from server
    // after adding or updating a menu
    this.menuSub = this.menusService.menu.subscribe((data) => {
      this.searchValue = '';
      this.infiniteScroll.disabled = false;
      this.menuList = [];
      this.pageNumber = 0;
      this.totalPages = 0;
      this.getMenus(undefined, 0, this.config.pageSize);
    });

    // Retrieves a partial list of menus from the server
    // upon component initialization
    this.getMenus(undefined, 0, this.config.pageSize);
  }

  getMenus(event?, pageNumber?: number, pageSize?: number, menuName?: string) {
    this.isFetching = true;

    if (menuName === undefined) {
      this.menusService
        .getMenus(pageNumber, pageSize)
        .subscribe(this.processMenuResult(event), (error) => {
          this.messageBox('Unable to communicate with the server.');
        });
    } else {
      this.menusService
        .getMenus(pageNumber, pageSize, menuName)
        .subscribe(this.processMenuResult(event), (error) => {
          this.messageBox('Unable to communicate with the server.');
        });
    }
  }

  processMenuResult(event?) {
    return (data) => {
      this.menuList = this.menuList.concat(data._embedded.menus);
      this.totalPages = data.page.totalPages;
      this.isFetching = false;
      if (event) {
        event.target.complete();
      }
    };
  }

  onLoadMoreOptions(menuId: number) {
    this.router.navigate(['/', 'tabs', 'orders', 'cart-menu', menuId]);
  }

  onAddToCart(menu: Menu) {
    this.cartService.postCartSingleMenu(menu).subscribe(this.processSaveMenu());
  }

  onEditCartMenu(menuId: number) {
    this.router.navigate(['/', 'tabs', 'menus', 'menu-detail', menuId]);
  }

  processSaveMenu() {
    return(menuData) => {
      this.messageBox('Menu has been added to cart.');
    };
  }

  loadMoreMenus(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      this.getMenus(
        event,
        this.pageNumber,
        this.config.pageSize,
        this.searchValue
      );
    } else {
      this.getMenus(event, this.pageNumber, this.config.pageSize);
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
    this.menuSearchBarSub.unsubscribe();
    this.menuSub.unsubscribe();
  }
}
