/* eslint-disable @typescript-eslint/quotes */
import { Warehouse } from "src/app/classes/warehouse.model";
import { InventoryHistoryItem } from "./inventory-history-item.model";

export class InventoryHistoryDto {
  constructor(
    public inventoryHistoryId?: number,
    public inventoryHistoryItems?: InventoryHistoryItem[],
    public warehouse?: Warehouse,
    public dateCreated?: string,
  ){}
}
