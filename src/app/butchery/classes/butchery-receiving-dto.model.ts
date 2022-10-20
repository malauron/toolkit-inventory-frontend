import { Customer } from 'src/app/classes/customer.model';
import { Vendor } from 'src/app/classes/vendor.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { ButcheryReceivingItem } from './butchery-receiving-item.model';

export class ButcheryReceivingDto {
  constructor(
    public butcheryReceivingId?: number,
    public receivingStatus?: string,
    public warehouse?: Warehouse,
    public vendor?: Vendor,
    public referenceCode?: string,
    public butcheryReceivingItems?: ButcheryReceivingItem[],
    public butcheryReceivingItem?: ButcheryReceivingItem,
    public totalAmount?: number,
    public dateCreated?: string,
    public errorDescription?: string,
  ) {}
}
