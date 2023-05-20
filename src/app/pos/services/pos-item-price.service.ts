import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';

@Injectable({
  providedIn: 'root',
})

export class PosItemPrice {

  constructor(
    private http: HttpClient,
    private config: AppParamsConfig,
  ){}

}
