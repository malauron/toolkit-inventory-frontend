import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { User } from '../classes/user.model';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})

export class UsersPage implements OnInit {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('searchBar', { static: true })
  searchBar: IonSearchbar;

  searchSub: Subscription;
  userSub: Subscription;

  users: User[] = [];

  searchValue = '';

  pageNumber = 0;
  totalPages = 0;

  isFetching = false;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private config: AppParamsConfig,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.usersService.getUsers(this.pageNumber,this.config.pageSize).subscribe(
      (res) => {
        console.log(res);
      }
    );
  }


  loadMoreReleasings(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      // this.getReleasings(
      //   event,
      //   this.pageNumber,
      //   this.config.pageSize,
      //   this.searchValue
      // );
    } else {
      // this.getReleasings(event, this.pageNumber, this.config.pageSize);
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
    this.searchSub.unsubscribe();
    this.userSub.unsubscribe();
  }

}
