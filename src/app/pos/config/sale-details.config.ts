export class SaleDetailsConfig {

  constructor(
    public saleStatusColor?: string,
    public saleStatusButton?: boolean,
    public saleStatusBadge?: boolean,
    public saleStatusPopover?: boolean,
    public deleteIngredientButton?: boolean,
    public updateIngredientButton?: boolean,
    public unpostedStatus?: boolean,
    public postedStatus?: boolean,
    public cancelledStatus?: boolean
  ) {
    this.setParams();
  }

  setParams(saleStatus?: string) {
    //Set initial values
    this.saleStatusColor = 'primay';
    this.saleStatusButton = false;
    this.saleStatusBadge = false;
    this.saleStatusPopover = false;
    this.deleteIngredientButton = false;
    this.updateIngredientButton = false;
    this.unpostedStatus = false;
    this.postedStatus = false;
    this.cancelledStatus = false;

    if (saleStatus === 'Unposted') {
      this.saleStatusColor = 'warning';
      this.saleStatusButton = true;
      this.saleStatusBadge = false;
      this.saleStatusPopover = true;
      this.deleteIngredientButton = true;
      this.updateIngredientButton = true;
      this.unpostedStatus = false;
      this.postedStatus = true;
      this.cancelledStatus = true;
    }

    if (saleStatus === 'Posted') {
      this.saleStatusColor = 'success';
      this.saleStatusButton = false;
      this.saleStatusBadge = true;
      this.saleStatusPopover = false;
      this.deleteIngredientButton = false;
      this.updateIngredientButton = false;
      this.unpostedStatus = false;
      this.postedStatus = true;
      this.cancelledStatus = true;
    }

    if (saleStatus === 'Cancelled') {
      this.saleStatusColor = 'primary';
      this.saleStatusButton = false;
      this.saleStatusBadge = true;
      this.saleStatusPopover = false;
      this.deleteIngredientButton = false;
      this.updateIngredientButton = false;
      this.unpostedStatus = false;
      this.postedStatus = false;
      this.cancelledStatus = true;
    }

  }

}
