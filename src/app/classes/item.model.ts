import { Uom } from './uom.model';
export class Item {
  constructor(
    public itemId?: number,
    public itemName?: string,
    public uom?: Uom,
    public dateCreated?: string) {}
}
