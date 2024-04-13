import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppParamsConfig } from "src/app/Configurations/app-params.config";
import { filterString } from "src/app/utils/utils";
import { ProjectClient } from "../classes/project-client.model";

interface ResponseProjectClients {
  _embedded: {
    projectClients: ProjectClient[];
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

export class ProjectClientsService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: AppParamsConfig,
  ){}

  getClients(
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: string,
  ): Observable<ResponseProjectClients> {
    if (searchDesc === undefined) {
      searchDesc = '';
    }

    filterString(searchDesc);

    this.apiUrl = `${this.config.urlProjectClientsSearch}/` +
                  `?clientName=${searchDesc}&page=${pageNumber}&size=${pageSize}`;

    return this.http.get<ResponseProjectClients>(this.apiUrl);
  }
}
