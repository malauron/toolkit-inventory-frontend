import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerGroup } from '../classes/customer-group.model';
import { AppParamsConfig } from '../Configurations/app-params.config';

@Injectable({
  providedIn: 'root',
})
export class CustomerGroupsService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: AppParamsConfig) {}

  getCustomerGroups(): Observable<CustomerGroup[]> {
    this.apiUrl = this.config.urlV1CustomerGroups;
    return this.http.get<CustomerGroup[]>(this.apiUrl);
  }
}
