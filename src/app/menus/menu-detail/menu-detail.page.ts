import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ItemSearchComponent } from '../../items/item-search/item-search.component';

// import Swiper core and required modules
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-menu-detail',
  templateUrl: './menu-detail.page.html',
  styleUrls: ['./menu-detail.page.scss'],
})
export class MenuDetailPage implements OnInit {
  pageLabel = 'Menu Detail';
  postButton = 'add';

  menuId: number;

  constructor(private modalItemSearch: ModalController) {}

  ngOnInit() {}

  onItemSearch() {
    this.modalItemSearch
      .create({ component: ItemSearchComponent })
      .then(modalSearch => {
        modalSearch.present();
      });
  }

  onSave() {}

  onSwiper([swiper]) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }
}
