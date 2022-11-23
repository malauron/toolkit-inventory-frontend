import { Item } from 'src/app/classes/item.model';
import { Warehouse } from 'src/app/classes/warehouse.model';

export class InventoryItemDto {
  constructor(
    public inventoryItemId?: number,
    public item?: Item,
    public warehouse?: Warehouse,
    public beginningQty?: number,
    public purchasedQty?: number,
    public endingQty?: number,
    public cost?: number,
    public price?: number,
    public qty?: number,
    public isUpdateQty?: boolean,
    public isUpdatePrice?: boolean,
  ) {}
}
