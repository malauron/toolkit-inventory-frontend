/* eslint-disable @typescript-eslint/quotes */
import { Warehouse } from "src/app/classes/warehouse.model";

export class InventoryHistory {
  constructor(
    public inventoryHistoryId?: number,
    public warehouse?: Warehouse,
    public dateCreated?: string,
  ){}
}
