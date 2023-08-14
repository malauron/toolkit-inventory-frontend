/* eslint-disable @typescript-eslint/quotes */
import { Item } from "src/app/classes/item.model";
import { ButcheryBatch } from "./butchery-batch.model";

export class ButcheryBatchInventory {
  constructor(
    public butcheryBatchInventoryId?: number,
    public butcheryBatch?: ButcheryBatch,
    public item?: Item,
    public receivedQty?: number,
    public receivedWeightKg?: number,
    public remainingQty?: number,
    public remainingWeightKg?: number,
  ){}
}
