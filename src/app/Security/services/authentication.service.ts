import { Injectable } from '@angular/core';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private appParamConfig: AppParamsConfig
  ) { }
}
