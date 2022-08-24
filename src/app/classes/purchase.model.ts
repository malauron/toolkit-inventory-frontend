import { Vendor } from './vendor.model';

export class Purchase{
  constructor(
    public purchaseId?: number,
    public vendor?: Vendor,
    public totalAmt?: number,
    public purchaseStatus?: string,
  ){}
}
