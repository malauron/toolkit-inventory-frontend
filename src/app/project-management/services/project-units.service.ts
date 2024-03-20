import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { PageInfo } from "src/app/classes/page-info.model";
import { AppParamsConfig } from "src/app/Configurations/app-params.config";
import { filterString } from "src/app/utils/utils";
import { ProjectUnit } from "../classes/project-unit.model"

interface ResponseProjectUnits {
  _embedded: {
    projectUnits: ProjectUnit[];
  };
  page: PageInfo;
}

@Injectable({
  providedIn: 'root',
})

export class ProjectUnitsService {

  private apiUrl: string;

  private _unitsHaveChanged = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private config: AppParamsConfig
  ){}

  get unitsHaveChanged() {
    return this._unitsHaveChanged;
  }

  getUnits(
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: any,
  ): Observable<ResponseProjectUnits>{

    if (searchDesc === undefined) {
      searchDesc = '';
    }

    filterString(searchDesc);

    this.apiUrl =
      `${this.config.urlProjectUnitsSearch}/` +
      `?searchDesc=${searchDesc}&page=${pageNumber}&size=${pageSize}`;

    return this.http.get<ResponseProjectUnits>(this.apiUrl);
  }
}
