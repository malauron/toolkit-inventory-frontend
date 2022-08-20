import { Uom } from './uom.model';

export class OrderMenuIngredientSummaryDto {
  constructor(
    public item?: {
      itemId: number;
      itemName: string;
    },
    public baseUom?: Uom,
    public totalQty?: number
  ){}
}
