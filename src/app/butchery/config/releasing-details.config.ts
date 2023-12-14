export class ReleasingDetailsConfig {

  constructor(
    public releasingStatusColor?: string,
    public releasingStatusButton?: boolean,
    public releasingStatusBadge?: boolean,
    public releasingStatusPopover?: boolean,
    public showItemOptionButtons?: boolean,
    public deleteIngredientButton?: boolean,
    public updateIngredientButton?: boolean,
    public unpostedStatus?: boolean,
    public postedStatus?: boolean,
    public cancelledStatus?: boolean
  ) {
    this.setParams();
  }

  setParams(releasingStatus?: string) {
    //Set initial values
    this.releasingStatusColor = 'primay';
    this.releasingStatusButton = false;
    this.releasingStatusBadge = false;
    this.releasingStatusPopover = false;
    this.showItemOptionButtons = false;
    this.deleteIngredientButton = false;
    this.updateIngredientButton = false;
    this.unpostedStatus = false;
    this.postedStatus = false;
    this.cancelledStatus = false;

    if (releasingStatus === 'Unposted') {
      this.releasingStatusColor = 'warning';
      this.releasingStatusButton = true;
      this.releasingStatusBadge = false;
      this.releasingStatusPopover = true;
      this.showItemOptionButtons = true;
      this.deleteIngredientButton = true;
      this.updateIngredientButton = true;
      this.unpostedStatus = false;
      this.postedStatus = true;
      this.cancelledStatus = true;
    }

    if (releasingStatus === 'Posted') {
      this.releasingStatusColor = 'success';
      this.releasingStatusButton = false;
      this.releasingStatusBadge = true;
      this.releasingStatusPopover = false;
      this.showItemOptionButtons = false;
      this.deleteIngredientButton = false;
      this.updateIngredientButton = false;
      this.unpostedStatus = false;
      this.postedStatus = true;
      this.cancelledStatus = true;
    }

    if (releasingStatus === 'Cancelled') {
      this.releasingStatusColor = 'primary';
      this.releasingStatusButton = false;
      this.releasingStatusBadge = true;
      this.releasingStatusPopover = false;
      this.showItemOptionButtons = false;
      this.deleteIngredientButton = false;
      this.updateIngredientButton = false;
      this.unpostedStatus = false;
      this.postedStatus = false;
      this.cancelledStatus = true;
    }

  }

}
