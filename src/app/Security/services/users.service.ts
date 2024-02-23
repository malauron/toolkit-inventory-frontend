/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable id-blacklist */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { User } from '../classes/user.model';
import { filterString } from '../../utils/utils';

interface ResponseUsers {
  content: User[];
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

@Injectable({
  providedIn: 'root',
})

export class UsersService {
  private apiUrl: string;

  private _usersUpdated = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private config: AppParamsConfig
  ){}

  get usersUpdated() {
    return this._usersUpdated;
  }

  getUsers(
    pageNumber: number,
    pageSize: number,
    searchDesc?: any
  ): Observable<ResponseUsers> {

    searchDesc = filterString(searchDesc);

    this.apiUrl = `${this.config.urlV1Users}?page=${pageNumber}&size=${pageSize}&searchDesc=${searchDesc}`;

    return this.http.get<ResponseUsers>(this.apiUrl);
  }

}
