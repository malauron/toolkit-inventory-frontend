import { VendorWarehouse } from 'src/app/classes/vendor-warehouse.model';
import { ButcheryBatchDetail } from './butchery-batch-detail.model';
import { User } from 'src/app/Security/classes/user.model';
import { Vendor } from 'src/app/classes/vendor.model';

export class ButcheryBatch {
  constructor(
    public butcheryBatchId?: number,
    public remarks?: string,
    public dateReceived?: string,
    public batchStatus?: string,
    public hasInventory?: boolean,
    public isOpen?: boolean,
    public vendorWarehouse?: VendorWarehouse,
    public vendor?: Vendor,
    public butcheryBatchDetails?: ButcheryBatchDetail[],
    public dateCreated?: string,
    public createdBy?: User,
  ){}
}
