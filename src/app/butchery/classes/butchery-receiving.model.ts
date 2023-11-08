import { VendorWarehouse } from 'src/app/classes/vendor-warehouse.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { ButcheryReceivingItem } from './butchery-receiving-item.model';

export class ButcheryReceiving {
  constructor(
    public butcheryReceivingId?: number,
    public warehouse?: Warehouse,
    public vendorWarehouse?: VendorWarehouse,
    public referenceCode?: string,
    public receivingStatus?: string,
    public butcheryReceivingItems?: ButcheryReceivingItem[],
    public totalKg?: number,
    public dateCreated?: string,
  ) {}
}
