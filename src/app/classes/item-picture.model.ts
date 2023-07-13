import { Item } from './item.model';

export class ItemPicture {
  constructor(
    public itemPictureId?: number,
    public item?: Item,
    public file?: any,
    public type?: string
  ){}
}
