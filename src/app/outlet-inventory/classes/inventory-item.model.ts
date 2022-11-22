import { Item } from 'src/app/classes/item.model';
import { Warehouse } from 'src/app/classes/warehouse.model';

export class InventoryItem {
  constructor(
    public inventoryItemId?: number,
    public item?: Item,
    public warehouse?: Warehouse,
    public beginningQty?: number,
    public purchasedQty?: number,
    public endingQty?: number,
    public cost?: number,
    public price?: number,
  ) {}
}
