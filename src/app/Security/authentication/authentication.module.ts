import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthenticationPageRoutingModule } from './authentication-routing.module';

import { AuthenticationPage } from './authentication.page';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AuthenticationPageRoutingModule,
  ],
  declarations: [AuthenticationPage],
})
export class AuthenticationPageModule {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    if (this.authenticationService.isUserLoggedIn()) {
      if (location.pathname === '/authentication') {
        this.router.navigateByUrl('/tabs/orders');
      }
      return;
    }
  }
}
