import { Vendor } from 'src/app/classes/vendor.model';
import { ButcheryBatch } from './butchery-batch.model';
import { ButcheryBatchDetailitem } from './butchery-batch-detail-item.model';

export class ButcheryBatchDetail {
  constructor(
    public butcheryBatchDetailId?: number,
    public butcheryBatch?: ButcheryBatch,
    public vendor?: Vendor,
    public referenceNo?: string,
    public totalRequiredWeightKg?: number,
    public totalReceivedWeightKg?: number,
    public butcheryBatchDetailItems?: ButcheryBatchDetailitem[]
  ){}
}
