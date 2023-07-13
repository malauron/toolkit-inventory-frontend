import { ItemClass } from './item-class.model';
import { ItemPicture } from './item-picture.model';
import { Uom } from './uom.model';
export class Item {
  constructor(
    public itemId?: number,
    public itemCode?: string,
    public itemName?: string,
    public uom?: Uom,
    public itemClass?: ItemClass,
    public price?: number,
    public isActive?: boolean,
    public isWeighable?: boolean,
    public isWeightBasedCost?: boolean,
    public itemPicture?: ItemPicture,
    public convertedPicture?: any,
    public dateCreated?: string) {}
}
