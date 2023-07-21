import { ButcheryBatch } from './butchery-batch.model';

export class ButcheryBatchDetail {
  constructor(
    public butcheryBatchDetailId?: number,
    public butcheryBatch?: ButcheryBatch,
    public referenceNo?: string,
  ){}
}
