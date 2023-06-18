import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { User } from '../classes/user.model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss'],
})
export class AuthenticationPage implements OnInit {
  userForm: FormGroup;

  isLoggingIn = false;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
      this.userForm = new FormGroup({
        username: new FormControl('', {
          validators: [Validators.required],
        }),
        password: new FormControl('', {
          validators: [Validators.required],
        }),
      });
  }

  onLogin() {
    if (this.isLoggingIn) {
      return;
    }
    this.isLoggingIn = true;
    if (!this.userForm.valid) {
      this.isLoggingIn = false;
      this.messageBox('Invalid credentials.');
    } else {
      const user = new User();
      user.username = this.userForm.value.username;
      user.password = this.userForm.value.password;
      this.authenticationService.login(user).subscribe(
        (response: HttpResponse<User>) => {
          const token = response.headers.get('Jwt-Token');
          this.authenticationService.saveToken(token);
          this.authenticationService.addUserToLocalCache(response.body);
          this.router.navigateByUrl('/tabs/orders');
        },
        (err: HttpErrorResponse) => {
          this.isLoggingIn = false;
          if (err.status === 0) {
            this.messageBox('Unable to communicate with the server.');
          } else {
            this.messageBox('Invalid credentials.');
          }
        }
      );
    }
  }

  messageBox(msg: string) {
    this.toastCtrl
      .create({
        color: 'warning',
        duration: 2000,
        position: 'top',
        message: msg,
      })
      .then((res) => {
        res.present();
      });
  }
}
