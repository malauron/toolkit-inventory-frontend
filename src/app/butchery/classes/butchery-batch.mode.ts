import { VendorWarehouse } from 'src/app/classes/vendor-warehouse.model';

export class ButcheryBatch {
  constructor(
    public butcheryBatchId?: number,
    public remarks?: string,
    public dateReceived?: string,
    public batchStatus?: boolean,
    public hasInventory?: boolean,
    public isOpen?: boolean,
    public vendorWarehouse?: VendorWarehouse,
    public dateCreated?: string,
  ){}
}
