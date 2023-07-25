import { VendorWarehouse } from 'src/app/classes/vendor-warehouse.model';
import { User } from 'src/app/Security/classes/user.model';
import { ButcheryBatchDetailitem } from './butchery-batch-detail-item.model';
import { ButcheryBatchDetail } from './butchery-batch-detail.model';
import { ButcheryBatch } from './butchery-batch.model';

export class ButcheryBatchDto  {
  constructor(
    public butcheryBatch?: ButcheryBatch,
    public butcheryBatchDetail?: ButcheryBatchDetail,
    public butcheryBatchDetailItem?: ButcheryBatchDetailitem,
    public butcheryBatchDetails?: ButcheryBatchDetail[],
    public error?: string,
  ){}
}
