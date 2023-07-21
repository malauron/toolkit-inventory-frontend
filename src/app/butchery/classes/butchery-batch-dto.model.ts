import { VendorWarehouse } from 'src/app/classes/vendor-warehouse.model';
import { User } from 'src/app/Security/classes/user.model';

export class ButcheryBatchDto  {
  constructor(
    public butcheryBatchId?: number,
    public remarks?: string,
    public dateReceived?: string,
    public batchStatus?: boolean,
    public hasInventory?: boolean,
    public isOpen?: boolean,
    public vendorWarehouse?: VendorWarehouse,
    public dateCreated?: string,
    public createdBy?: User,
    public error?: string,
  ){}
}
