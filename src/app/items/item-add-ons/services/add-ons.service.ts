import { ItemAddOnDetail } from '../classes/item-add-on-detail.model';

export class AddOnsServices{
  private itemAddOnDetails: ItemAddOnDetail[];

  addItemDetail(itemAddOnDetail: ItemAddOnDetail) {
    this.itemAddOnDetails = this.itemAddOnDetails.concat(itemAddOnDetail);
  }

  setItemAddOnDetails(itemAddOnDetails: ItemAddOnDetail[]){
    this.itemAddOnDetails = itemAddOnDetails;
  }

  getItemAddOnDetails(): ItemAddOnDetail[] {
    return this.itemAddOnDetails;
  }
}
