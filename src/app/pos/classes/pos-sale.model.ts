import { Customer } from 'src/app/classes/customer.model';
import { Warehouse } from 'src/app/classes/warehouse.model';
import { PosSaleItem } from './pos-sale-item.model';

export class PosSale  {
  constructor(
    public posSaleId?: number,
    public warehouse?: Warehouse,
    public customer?: Customer,
    public saleStatus?: string,
    public posSaleItems?: PosSaleItem[],
    public totalAmount?: number,
    public dateCreated?: string,
  ) {}
}
