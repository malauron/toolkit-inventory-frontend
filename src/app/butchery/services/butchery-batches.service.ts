import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ButcheryBatchDto } from '../classes/butchery-batch-dto.model';

@Injectable({
  providedIn: 'root'
})

export class ButcheryBatchesService {

  private apiUrl: string;
  private urlV1ButcheryBatch: string;

  constructor(
    private http: HttpClient,
    private config: AppParamsConfig
  ){
    this.urlV1ButcheryBatch = `${this.config.urlV1}/butcheryBatches`;
  }

  postButcheryBatch(butcheryBatch: ButcheryBatchDto): Observable<ButcheryBatchDto> {
    return this.http.post<ButcheryBatchDto>(this.urlV1ButcheryBatch, butcheryBatch);
  }

}
