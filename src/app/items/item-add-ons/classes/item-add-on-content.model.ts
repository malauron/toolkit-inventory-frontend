import { Item } from 'src/app/classes/item.model';
import { Uom } from 'src/app/classes/uom.model';
import { ItemAddOnDetail } from './item-add-on-detail.model';

export class ItemAddOnContent {
  constructor(
    public itemAddOnContentId?: number,
    public itemAddOnDetail?: ItemAddOnDetail,
    public item?: Item,
    public uom?: Uom,
    public qty?: number,
    public price?: number,
    public altDesc?: string
  ){}
}
