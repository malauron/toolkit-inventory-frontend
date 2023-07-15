import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar, ToastController } from '@ionic/angular';
import { debounceTime, distinctUntilChanged, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-batches',
  templateUrl: './butchery-batches.page.html',
  styleUrls: ['./butchery-batches.page.scss'],
})
export class ButcheryBatchesPage implements OnInit {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('searchBar', { static: true }) searchBar: IonSearchbar;

  itemSearchBarSubscription: Subscription;
  itemSubcription: Subscription;

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.itemSearchBarSubscription = this.searchBar.ionInput
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        this.searchValue = res.trim();
        this.infiniteScroll.disabled = false;
        // this.itemLists = [];
        this.pageNumber = 0;
        this.totalPages = 0;
        if (this.searchValue) {
          // this.getItems(undefined, 0, this.config.pageSize, this.searchValue);
        } else {
          // this.getItems(undefined, 0, this.config.pageSize);
        }
      });
  }

  onAddBatch(){
    this.router.navigate(['/', 'tabs', 'butchery-batches', 'butchery-batch', 0]);
  }

  loadMoreItems(event) {

    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    // if (this.searchValue) {
    //   this.getItems(
    //     event,
    //     this.pageNumber,
    //     this.config.pageSize,
    //     this.searchValue
    //   );
    // } else {
    //   this.getItems(event, this.pageNumber, this.config.pageSize);
    // }
  }

  async messageBox(messageDescription: string) {
    const toast = await this.toastCtrl.create({
      color: 'dark',
      duration: 2000,
      position: 'top',
      message: messageDescription,
    });

    await toast.present();
  }

}
