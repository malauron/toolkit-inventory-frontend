import { PurchaseItem } from './purchase-item.model';
import { Vendor } from './vendor.model';

export class PurchaseDto {
  constructor(
    public purchaseId?: number,
    public totalAmt?: number,
    public purchaseStatus?: string,
    public vendor?: Vendor,
    public purchaseItems?: PurchaseItem[],
    public dateCreated?: string,
  ){}
}
