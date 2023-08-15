export class ButcheryBatchConfig  {

  constructor(
    public statusColor?: string,
    public showStatusButton?: boolean,
    public showStatusBadge?: boolean,
    public showStatusPopover?: boolean,
    public showDetailOptionButtons?: boolean,
    public showItemOptionButtons?: boolean,
    public canSelectVendorWarehouse?: boolean,
    public canSelectVendor?: boolean,
    public unpostedStatus?: boolean,
    public postedStatus?: boolean,
    public cancelledStatus?: boolean
  ) {
    this.setParams();
  }

  setParams(status?: string) {
    //Set initial values
    this.statusColor = 'primay';
    this.showStatusButton = false;
    this.showStatusBadge = false;
    this.showStatusPopover = false;
    this.showDetailOptionButtons = false;
    this.showItemOptionButtons = false;
    this.canSelectVendorWarehouse = false;
    this.canSelectVendor = false;
    this.unpostedStatus = false;
    this.postedStatus = false;
    this.cancelledStatus = false;

    if (status === 'Unposted') {
      this.statusColor = 'warning';
      this.showStatusButton = true;
      this.showStatusBadge = false;
      this.showStatusPopover = true;
      this.showDetailOptionButtons = true;
      this.showItemOptionButtons = true;
      this.canSelectVendorWarehouse = true;
      this.canSelectVendor = true;
      this.unpostedStatus = false;
      this.postedStatus = true;
      this.cancelledStatus = true;
    }

    if (status === 'Posted') {
      this.statusColor = 'success';
      this.showStatusButton = false;
      this.showStatusBadge = true;
      this.showStatusPopover = false;
      this.showDetailOptionButtons = false;
      this.showItemOptionButtons = false;
      this.canSelectVendorWarehouse = false;
      this.canSelectVendor = false;
      this.unpostedStatus = false;
      this.postedStatus = true;
      this.cancelledStatus = true;
    }

    if (status === 'Cancelled') {
      this.statusColor = 'primary';
      this.showStatusButton = false;
      this.showStatusBadge = true;
      this.showStatusPopover = false;
      this.showDetailOptionButtons = false;
      this.showItemOptionButtons = false;
      this.canSelectVendorWarehouse = false;
      this.canSelectVendor = false;
      this.unpostedStatus = false;
      this.postedStatus = false;
      this.cancelledStatus = true;
    }

  }

}
