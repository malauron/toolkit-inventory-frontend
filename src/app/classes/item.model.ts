import { ItemClass } from './item-class.model';
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
    public dateCreated?: string) {}
}
