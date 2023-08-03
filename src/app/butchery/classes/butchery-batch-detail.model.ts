import { Vendor } from 'src/app/classes/vendor.model';
import { ButcheryBatch } from './butchery-batch.model';
import { ButcheryBatchDetailitem } from './butchery-batch-detail-item.model';

export class ButcheryBatchDetail {
  constructor(
    public butcheryBatchDetailId?: number,
    public butcheryBatch?: ButcheryBatch,
    public referenceNo?: string,
    public totalDocumentedWeightKg?: number,
    public totalReceivedWeightKg?: number,
    public butcheryBatchDetailItems?: ButcheryBatchDetailitem[]
  ){}
}
