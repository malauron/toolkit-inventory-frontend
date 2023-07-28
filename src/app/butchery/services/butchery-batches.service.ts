import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageInfo } from 'src/app/classes/page-info.model';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { ButcheryBatchDto } from '../classes/butchery-batch-dto.model';
import { ButcheryBatch } from '../classes/butchery-batch.model';
import { filterString } from '../utils/utils';

interface ResponseButcheryBatches {
  _embedded: {
    butcheryBatches: ButcheryBatch[];
  };
  page: PageInfo;
}

@Injectable({
  providedIn: 'root',
})
export class ButcheryBatchesService {
  private apiUrl: string;
  private urlButcheryBatches: string;
  private urlV1ButcheryBatches: string;
  private urlV1ButcheryBatchDetails: string;
  private urlV1ButcheryBatchDetailItems: string;

  constructor(private http: HttpClient, private config: AppParamsConfig) {
    this.urlButcheryBatches = `${this.config.url}/butcheryBatches`;
    this.urlV1ButcheryBatches = `${this.config.urlV1}/butcheryBatches`;
    this.urlV1ButcheryBatchDetails = `${this.config.urlV1}/butcheryBatchDetails`;
    this.urlV1ButcheryBatchDetailItems = `${this.config.urlV1}/butcheryBatchDetailItems`;
  }

  getButcheryBatch(batchId: number): Observable<ButcheryBatchDto> {
    this.apiUrl = `${this.urlV1ButcheryBatches}?butcheryBatchId=${batchId}`;
    return this.http.get<ButcheryBatchDto>(this.apiUrl);
  }

  getButcheryBatches(
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: string
  ): Observable<ResponseButcheryBatches> {
    if (searchDesc === undefined) {
      searchDesc = '';
    } else {
      searchDesc = filterString(searchDesc);
    }

    if (searchDesc === '') {
      this.apiUrl = `${this.urlButcheryBatches}/search/findAllBatches?page=${pageNumber}&size=${pageSize}`;
    } else {
      this.apiUrl = `${this.urlButcheryBatches}/search/findByWarehouseRemarks?searchDesc=${searchDesc}&page=${pageNumber}&size=${pageSize}`;
    }

    return this.http.get<ResponseButcheryBatches>(this.apiUrl);
  }

  postButcheryBatch(dto: ButcheryBatchDto): Observable<ButcheryBatchDto> {
    return this.http.post<ButcheryBatchDto>(this.urlV1ButcheryBatches, dto);
  }

  putButcheryBatch(dto: ButcheryBatch): Observable<ButcheryBatchDto> {
    return this.http.put<ButcheryBatchDto>(this.urlV1ButcheryBatches, dto);
  }

  postButcheryBatchDetail(dto: ButcheryBatchDto): Observable<ButcheryBatchDto> {
    return this.http.post<ButcheryBatchDto>(
      this.urlV1ButcheryBatchDetails,
      dto
    );
  }

  postButcheryBatchDetailItem(
    dto: ButcheryBatchDto
  ): Observable<ButcheryBatchDto> {
    return this.http.post<ButcheryBatchDto>(
      this.urlV1ButcheryBatchDetailItems,
      dto
    );
  }

  deleteButcheryBatchDetail(
    dto: ButcheryBatchDto
  ): Observable<ButcheryBatchDto> {
    const options = {
      headers: new HttpHeaders({
        contentType: 'application/json',
      }),
      body: dto,
    };

    return this.http.delete<ButcheryBatchDto>(
      this.urlV1ButcheryBatchDetails,
      options
    );
  }

  deleteButcheryBatchDetailItem(
    dto: ButcheryBatchDto
  ): Observable<ButcheryBatchDto> {
    const options = {
      headers: new HttpHeaders({
        contentType: 'application/json',
      }),
      body: dto,
    };

    return this.http.delete<ButcheryBatchDto>(
      this.urlV1ButcheryBatchDetailItems,
      options
    );
  }
}
