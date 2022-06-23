/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Menu } from '../classes/menu.model';
import { ConfigParam } from '../ConfigParam';
import { MenuService } from '../services/menus.service';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.page.html',
  styleUrls: ['./menus.page.scss'],
})
export class MenusPage implements OnInit, OnDestroy {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('menuSearchBar', { static: true }) menuSearchBar: IonSearchbar;

  menuSearchBarSub: Subscription;

  menuList: Menu[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private menuService: MenuService,
    private router: Router,
    private config: ConfigParam
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

    this.getMenus();
  }

  getMenus(event?, pageNumber?: number, pageSize?: number, menuName?: string) {
    this.isFetching = true;

    if (menuName === undefined) {
      this.menuService
        .getMenus(pageNumber, pageSize)
        .subscribe(this.processMenuResult());
    } else {
      this.menuService.getMenus(pageNumber,pageSize,menuName)
      .subscribe(this.processMenuResult());
    }
    // this.menuService.getMenus().subscribe(
    //   this.processMenuResult()
    // );
  }

  processMenuResult() {
    return (data) => {
      this.menuList = this.menuList.concat(data._embedded.menus);
      this.isFetching = false;
    };
  }

  onAddMenu() {
    this.router.navigate(['/', 'tabs', 'menus', 'menu-detail', 0]);
  }

  onEditMenu(menuId: number) {
    this.router.navigate(['/', 'tabs', 'menus', 'menu-detail', menuId]);
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

  ngOnDestroy(): void {
    this.menuSearchBarSub.unsubscribe();
  }
}
