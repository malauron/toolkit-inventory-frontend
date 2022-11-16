import { Vendor } from 'src/app/classes/vendor.model';
import { ButcheryReceivingItem } from './butchery-receiving-item.model';

export class ButcheryLiveStock {
  constructor(
    public butcheryLivestockId?: number,
    public butcheryReceivingItem?: ButcheryReceivingItem,
    public vendor?: Vendor,
    public livestockType?: string,
    public noOfHeads?: number,
    public weight?: number,
    public cost?: number,
    public totalCost?: number,
  ){}
}
