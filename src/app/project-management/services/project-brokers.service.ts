import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppParamsConfig } from "src/app/Configurations/app-params.config";
import { filterString } from "src/app/utils/utils";
import { ProjectBroker } from "../classes/project-broker.model";

interface ResponseProjectBrokers {
  _embedded: {
    projectBrokers: ProjectBroker[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

@Injectable({
  providedIn: 'root',
})

export class ProjectBrokersService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: AppParamsConfig,
  ){}

  getBrokers(
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: string,
  ): Observable<ResponseProjectBrokers> {
    if (searchDesc === undefined) {
      searchDesc = '';
    }

    filterString(searchDesc);

    this.apiUrl = `${this.config.urlProjectBrokersSearch}` +
                  `?brokerName=${searchDesc}&page=${pageNumber}&size=${pageSize}`;

    return this.http.get<ResponseProjectBrokers>(this.apiUrl);
  }
}
