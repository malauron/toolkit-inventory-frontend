import { ItemClass } from './item-class.model';
import { Uom } from './uom.model';
export class Item {
  constructor(
    public itemId?: number,
    public itemName?: string,
    public uom?: Uom,
    public itemClass?: ItemClass,
    public isActive?: boolean,
    public dateCreated?: string) {}
}
