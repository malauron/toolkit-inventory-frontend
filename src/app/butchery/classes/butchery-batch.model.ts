import { VendorWarehouse } from 'src/app/classes/vendor-warehouse.model';
import { ButcheryBatchDetail } from './butchery-batch-detail.model';

export class ButcheryBatch {
  constructor(
    public butcheryBatchId?: number,
    public remarks?: string,
    public dateReceived?: string,
    public batchStatus?: string,
    public hasInventory?: boolean,
    public isOpen?: boolean,
    public vendorWarehouse?: VendorWarehouse,
    public butcheryBatchDetails?: ButcheryBatchDetail[],
    public dateCreated?: string,
  ){}
}
