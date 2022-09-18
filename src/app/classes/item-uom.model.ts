import { Item } from './item.model';
import { Uom } from './uom.model';

export class ItemUom {

  constructor(
    public item?: Item,
    public uom?: Uom,
    public quantity?: number) {}

}
