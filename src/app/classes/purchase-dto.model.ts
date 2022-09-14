import { PurchaseItem } from './purchase-item.model';
import { Vendor } from './vendor.model';
import { Warehouse } from './warehouse.model';

export class PurchaseDto {
  constructor(
    public purchaseId?: number,
    public totalAmt?: number,
    public purchaseStatus?: string,
    public vendor?: Vendor,
    public warehouse?: Warehouse,
    public purchaseItems?: PurchaseItem[],
    public purchaseItem?: PurchaseItem,
    public dateCreated?: string,
  ){}
}
