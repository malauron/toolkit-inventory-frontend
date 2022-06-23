/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from '../classes/menu.model';
import { MenuService } from '../services/menus.service';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.page.html',
  styleUrls: ['./menus.page.scss'],
})
export class MenusPage implements OnInit {

  menuList: Menu[] = [];

  isFetching = false;

  constructor(
    private menuService: MenuService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getMenus();
  }

  getMenus() {
    this.isFetching = true;
    this.menuService.getMenus().subscribe(
      this.processMenuResult()
    );
  }

  processMenuResult() {
    return (data) => {
      this.menuList = this.menuList.concat(data._embedded.menus);
      this.isFetching = false;
    };
  }

  onAddMenu() {
    this.router.navigate(['/','tabs','menus','menu-detail',0]);
  }

  onEditMenu(menuId: number) {
    this.router.navigate(['/','tabs','menus','menu-detail',menuId]);
  }

}
