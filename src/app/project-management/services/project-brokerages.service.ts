import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppParamsConfig } from "src/app/Configurations/app-params.config";
import { filterString } from "src/app/utils/utils";
import { ProjectBrokerage } from "../classes/project-brokerage.model";

interface ResponseProjectBrokerages {
  _embedded: {
    projectBrokerages: ProjectBrokerage[];
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

export class ProjectBrokeragesService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: AppParamsConfig,
  ){}

  getBrokerages(
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: string,
  ): Observable<ResponseProjectBrokerages> {
    if (searchDesc === undefined) {
      searchDesc = '';
    }

    searchDesc = filterString(searchDesc);

    this.apiUrl = `${this.config.urlProjectBrokeragesSearch}` +
                  `?brokerageName=${searchDesc}&page=${pageNumber}&size=${pageSize}`;

    return this.http.get<ResponseProjectBrokerages>(this.apiUrl);
  }
}
