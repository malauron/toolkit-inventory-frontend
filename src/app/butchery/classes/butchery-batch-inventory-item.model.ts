/* eslint-disable @typescript-eslint/quotes */
import { Item } from "src/app/classes/item.model";

export class ButcheryBatchInventoryItem {
  constructor(
    public item?: Item,
    public receivedQty?: number,
    public receivedWeightKg?: number,
    public remainingQty?: number,
    public remainingWeightKg?: number,
  ){}
}
