import { Item } from 'src/app/classes/item.model';
import { ButcheryBatchDetail } from './butchery-batch-detail.model';
import { Uom } from 'src/app/classes/uom.model';

export class ButcheryBatchDetailitem {
  constructor(
    public butcheryBatchDetailItemId?: number,
    public butcheryBatchDetail?: ButcheryBatchDetail,
    public item?: Item,
    public baseUom?: Uom,
    public baseQty?: number,
    public requiredUom?: Uom,
    public documentedQty?: number,
    public receivedQty?: number,
    public documentedWeightKg?: number,
    public receivedWeightKg?: number,
  ){}
}
