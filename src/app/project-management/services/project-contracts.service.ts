/* eslint-disable no-underscore-dangle */
import { PageInfo } from 'src/app/classes/page-info.model';
import { ProjectContract } from '../classes/project-contract.model';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ProjectContractDto } from '../classes/project-contract-dto.model';

interface ResponseProjectContracts {
  _embedded: {
    projectContracts: ProjectContract[];
  };
  page: PageInfo;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectContractsService {
  private apiUrl: string;

  private _contractsHaveChanged = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private config: AppParamsConfig
  ){}

  get contractsHaveChanged(){
    return this._contractsHaveChanged;
  }

  getContract(id: number): Observable<ProjectContract> {

    this.apiUrl = ``;
    return this.http.get<ProjectContractDto>(this.apiUrl);
  }

  postContract(contractDto: ProjectContractDto): Observable<ProjectContractDto>{
    this.apiUrl = `${this.config.urlV1ProjectContracts}`;
    return this.http.post<ProjectContractDto>(this.apiUrl, contractDto);
  }
}
