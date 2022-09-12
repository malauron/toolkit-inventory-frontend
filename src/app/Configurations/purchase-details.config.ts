export class PurchaseDetailsConfig {
  constructor(
    public purchaseStatusColor?: string,
    public purchaseStatusButton?: boolean,
    public purchaseStatusBadge?: boolean,
    public purchaseStatusPopover?: boolean,
    public deleteIngredientButton?: boolean,
    public updateIngredientButton?: boolean,
    public unpostedStatus?: boolean,
    public postedStatus?: boolean,
    public cancelledStatus?: boolean
  ) {
    this.setParams();
  }

  setParams(purchaseStatus?: string) {
    //Set initial values
    this.purchaseStatusColor = 'primay';
    this.purchaseStatusButton = false;
    this.purchaseStatusBadge = false;
    this.purchaseStatusPopover = false;
    this.deleteIngredientButton = false;
    this.updateIngredientButton = false;
    this.unpostedStatus = false;
    this.postedStatus = false;
    this.cancelledStatus = false;

    if (purchaseStatus === 'Unposted') {
      this.purchaseStatusColor = 'warning';
      this.purchaseStatusButton = true;
      this.purchaseStatusBadge = false;
      this.purchaseStatusPopover = true;
      this.deleteIngredientButton = true;
      this.updateIngredientButton = true;
      this.unpostedStatus = false;
      this.postedStatus = true;
      this.cancelledStatus = true;
    }

    if (purchaseStatus === 'Posted') {
      this.purchaseStatusColor = 'success';
      this.purchaseStatusButton = false;
      this.purchaseStatusBadge = true;
      this.purchaseStatusPopover = false;
      this.deleteIngredientButton = false;
      this.updateIngredientButton = false;
      this.unpostedStatus = false;
      this.postedStatus = true;
      this.cancelledStatus = true;
    }

    if (purchaseStatus === 'Cancelled') {
      this.purchaseStatusColor = 'primary';
      this.purchaseStatusButton = false;
      this.purchaseStatusBadge = true;
      this.purchaseStatusPopover = false;
      this.deleteIngredientButton = false;
      this.updateIngredientButton = false;
      this.unpostedStatus = false;
      this.postedStatus = false;
      this.cancelledStatus = true;
    }

  }

}
