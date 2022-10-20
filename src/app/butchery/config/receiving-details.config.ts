export class ReceivingDetailsConfig {

  constructor(
    public receivingStatusColor?: string,
    public receivingStatusButton?: boolean,
    public receivingStatusBadge?: boolean,
    public receivingStatusPopover?: boolean,
    public deleteIngredientButton?: boolean,
    public updateIngredientButton?: boolean,
    public unpostedStatus?: boolean,
    public postedStatus?: boolean,
    public cancelledStatus?: boolean
  ) {
    this.setParams();
  }

  setParams(receivingStatus?: string) {
    //Set initial values
    this.receivingStatusColor = 'primay';
    this.receivingStatusButton = false;
    this.receivingStatusBadge = false;
    this.receivingStatusPopover = false;
    this.deleteIngredientButton = false;
    this.updateIngredientButton = false;
    this.unpostedStatus = false;
    this.postedStatus = false;
    this.cancelledStatus = false;

    if (receivingStatus === 'Unposted') {
      this.receivingStatusColor = 'warning';
      this.receivingStatusButton = true;
      this.receivingStatusBadge = false;
      this.receivingStatusPopover = true;
      this.deleteIngredientButton = true;
      this.updateIngredientButton = true;
      this.unpostedStatus = false;
      this.postedStatus = true;
      this.cancelledStatus = true;
    }

    if (receivingStatus === 'Posted') {
      this.receivingStatusColor = 'success';
      this.receivingStatusButton = false;
      this.receivingStatusBadge = true;
      this.receivingStatusPopover = false;
      this.deleteIngredientButton = false;
      this.updateIngredientButton = false;
      this.unpostedStatus = false;
      this.postedStatus = true;
      this.cancelledStatus = true;
    }

    if (receivingStatus === 'Cancelled') {
      this.receivingStatusColor = 'primary';
      this.receivingStatusButton = false;
      this.receivingStatusBadge = true;
      this.receivingStatusPopover = false;
      this.deleteIngredientButton = false;
      this.updateIngredientButton = false;
      this.unpostedStatus = false;
      this.postedStatus = false;
      this.cancelledStatus = true;
    }

  }

}
