import { Item } from './item.model';
import { Warehouse } from './warehouse.model';

export class ItemCost {
  constructor(
    public item?: Item,
    public warehouse?: Warehouse,
    public cost?: number,
    public qty?: number
  ) {}
}
