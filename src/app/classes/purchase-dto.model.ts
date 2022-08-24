import { PurchaseItem } from './purchase-item.model';
import { Vendor } from './vendor.model';

export class PurchaseDto {
  constructor(
    public totalAmt?: number,
    public vendor?: Vendor,
    public purchaseItems?: PurchaseItem[]
  ){}
}
