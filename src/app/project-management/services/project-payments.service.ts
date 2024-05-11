import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PageInfo } from 'src/app/classes/page-info.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { filterString } from 'src/app/utils/utils';
import { ProjectPayment } from '../classes/project-payment.model';

interface ResponsePayments {
  _embedded: {
    projectPayments: ProjectPayment[];
  };
  page: PageInfo;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectPaymentsService {
  private apiUrl: string;

  private _paymentsHaveChanged = new Subject<boolean>();

  constructor(private http: HttpClient, private config: AppParamsConfig) {}

  get paymentHaveChanged() {
    return this._paymentsHaveChanged;
  }

  getPayments(
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: any
  ): Observable<ResponsePayments> {
    if (searchDesc === undefined) {
      searchDesc = '';
    }

    searchDesc = filterString(searchDesc);

    this.apiUrl =
      `${this.config.urlProjectPaymentsSearch}` +
      `?searchDesc=${searchDesc}&page=${pageNumber}&size=${pageSize}`;

    return this.http.get<ResponsePayments>(this.apiUrl);
  }
}
