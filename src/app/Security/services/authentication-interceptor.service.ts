/* eslint-disable @typescript-eslint/naming-convention */
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SecurityParamsConfig } from '../Configurations/security-params.config';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthenticationInterceptorService implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService,
    private securityParamsConfig: SecurityParamsConfig
  ) { }
  intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
    if (httpRequest.url.includes(`${this.securityParamsConfig.rootV1Url}/login`)) {
      return httpHandler.handle(httpRequest);
    }
    this.authenticationService.loadToken();
    const token = this.authenticationService.getToken();
    const request = httpRequest.clone({ setHeaders: { Authorization: `Bearer ${token}` }});
    return httpHandler.handle(request);
  }
}
