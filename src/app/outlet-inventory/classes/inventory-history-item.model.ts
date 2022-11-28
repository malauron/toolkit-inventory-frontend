/* eslint-disable @typescript-eslint/quotes */
import { Item } from "src/app/classes/item.model";
import { InventoryHistory } from "./inventory-history.model";

export class InventoryHistoryItem {
  constructor(
    public inventoryHistoryItemId?: number,
    public inventoryHistory?: InventoryHistory,
    public item?: Item,
    public beginningQty?: number,
    public purchasedQty?: number,
    public endingQty?: number,
    public cost?: number,
    public price?: number
  ){}
}
