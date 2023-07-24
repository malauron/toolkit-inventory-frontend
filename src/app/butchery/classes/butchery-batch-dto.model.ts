import { VendorWarehouse } from 'src/app/classes/vendor-warehouse.model';
import { User } from 'src/app/Security/classes/user.model';
import { ButcheryBatchDetail } from './butchery-batch-detail.model';
import { ButcheryBatch } from './butchery-batch.model';

export class ButcheryBatchDto  {
  constructor(
    public vendorWarehouse?: VendorWarehouse,
    public butcheryBatchDetails?: ButcheryBatchDetail[],
    public createdBy?: User,
    public butcheryBatch?: ButcheryBatch,
    public error?: string,
  ){}
}
