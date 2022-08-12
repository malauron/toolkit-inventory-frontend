import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Uom } from '../classes/uom.model';
import { AppParamsConfig } from '../Configurations/app-params.config';

interface ResponseUoms {
  _embedded: {
    uoms: Uom[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class UomsService {

  constructor(private http: HttpClient, private config: AppParamsConfig) { }

  getUoms(): Observable<ResponseUoms> {
    return this.http.get<ResponseUoms>(this.config.urlUoms);
  }

  findAllUoms(): Observable<ResponseUoms> {
    return this.http.get<ResponseUoms>(this.config.urlUoms + '/search/findAllUoms');
  }
}
