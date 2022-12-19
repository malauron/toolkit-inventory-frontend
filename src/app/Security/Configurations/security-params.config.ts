import { Injectable } from '@angular/core';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';

@Injectable({
  providedIn: 'root',
})
export class SecurityParamsConfig {
  rootUrl: any;
  rootV1Url: any;

  constructor(private appParamsConfig: AppParamsConfig) {
    this.rootUrl = this.appParamsConfig.url;
    this.rootV1Url = `${this.rootUrl}/v1`;
  }
}
