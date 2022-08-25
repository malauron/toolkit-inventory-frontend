import { PurchaseItem } from './purchase-item.model';
import { Vendor } from './vendor.model';

export class Purchase{
  constructor(
    public purchaseId?: number,
    public vendor?: Vendor,
    public purchaseItems?: PurchaseItem[],
    public totalAmt?: number,
    public purchaseStatus?: string,
    public dateCreated?: string,
  ){}
}
