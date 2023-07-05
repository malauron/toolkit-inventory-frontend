import { Item } from 'src/app/classes/item.model';
import { ItemAddOnContent } from './item-add-on-content.model';

export class ItemAddOnDetail {
  constructor(
    public itemAddOnDetailId?: number,
    public item?: Item,
    public description?: string,
    public isRequired?: boolean,
    public maxNoOfItems?: number,
    public itemAddOnContents?: ItemAddOnContent[]
  ){}
}
