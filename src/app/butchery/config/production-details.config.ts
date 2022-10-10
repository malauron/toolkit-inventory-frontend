export class ProductionDetailsConfig {

  constructor(
    public productionStatusColor?: string,
    public productionStatusButton?: boolean,
    public productionStatusBadge?: boolean,
    public productionStatusPopover?: boolean,
    public deleteIngredientButton?: boolean,
    public updateIngredientButton?: boolean,
    public unpostedStatus?: boolean,
    public postedStatus?: boolean,
    public cancelledStatus?: boolean
  ) {
    this.setParams();
  }

  setParams(productionStatus?: string) {
    //Set initial values
    this.productionStatusColor = 'primay';
    this.productionStatusButton = false;
    this.productionStatusBadge = false;
    this.productionStatusPopover = false;
    this.deleteIngredientButton = false;
    this.updateIngredientButton = false;
    this.unpostedStatus = false;
    this.postedStatus = false;
    this.cancelledStatus = false;

    if (productionStatus === 'Unposted') {
      this.productionStatusColor = 'warning';
      this.productionStatusButton = true;
      this.productionStatusBadge = false;
      this.productionStatusPopover = true;
      this.deleteIngredientButton = true;
      this.updateIngredientButton = true;
      this.unpostedStatus = false;
      this.postedStatus = true;
      this.cancelledStatus = true;
    }

    if (productionStatus === 'Posted') {
      this.productionStatusColor = 'success';
      this.productionStatusButton = false;
      this.productionStatusBadge = true;
      this.productionStatusPopover = false;
      this.deleteIngredientButton = false;
      this.updateIngredientButton = false;
      this.unpostedStatus = false;
      this.postedStatus = true;
      this.cancelledStatus = true;
    }

    if (productionStatus === 'Cancelled') {
      this.productionStatusColor = 'primary';
      this.productionStatusButton = false;
      this.productionStatusBadge = true;
      this.productionStatusPopover = false;
      this.deleteIngredientButton = false;
      this.updateIngredientButton = false;
      this.unpostedStatus = false;
      this.postedStatus = false;
      this.cancelledStatus = true;
    }

  }

}
