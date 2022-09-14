export class OrderDetailsConfig {

  constructor(
  public orderStatusColor?: string,
  public orderStatusButton?: boolean,
  public orderStatusBadge?: boolean,
  public excludedIngredientIcon?: boolean,
  public deleteIngredientButton?: boolean,
  public includedIngredientIcon?: boolean,
  public ingredientsBottomDiv?: boolean,
  public optionButtonsContainer?: boolean,
  public printPreviewButton?: boolean,
  public removeMenuButton?: boolean,
  public orderStatusPopover?: boolean,
  public preparingStatus?: boolean,
  public packedStatus?: boolean,
  public inTransitStatus?: boolean,
  public deliveredStatus?: boolean,
  public cancelledStatus?: boolean

  ){
    this.setParams();
  }

setParams(orderStatus?: string) {

  //Set initial values
  this.orderStatusColor = 'primary';
  this.orderStatusButton = false;
  this.orderStatusBadge = false;
  this.excludedIngredientIcon = false;
  this.deleteIngredientButton = false;
  this.includedIngredientIcon = false;
  this.ingredientsBottomDiv = false;
  this.optionButtonsContainer = false;
  this.printPreviewButton = false;
  this.removeMenuButton = false;
  this.orderStatusPopover = false;
  this.preparingStatus = false;
  this.packedStatus = false;
  this.inTransitStatus = false;
  this.deliveredStatus = false;
  this.cancelledStatus = false;

  if (orderStatus === 'Preparing') {
    this.orderStatusColor = 'warning';
    this.orderStatusButton = true;
    this.orderStatusBadge = false;
    this.excludedIngredientIcon = true;
    this.deleteIngredientButton = true;
    this.includedIngredientIcon = false;
    this.ingredientsBottomDiv = true;
    this.optionButtonsContainer = true;
    this.printPreviewButton = true;
    this.removeMenuButton = true;
    this.orderStatusPopover = true;
    this.preparingStatus = false;
    this.packedStatus = true;
    this.inTransitStatus = false;
    this.deliveredStatus = false;
    this.cancelledStatus = true;
  }

  if (orderStatus === 'Packed') {
    this.orderStatusColor = 'secondary';
    this.orderStatusButton = true;
    this.orderStatusBadge = false;
    this.excludedIngredientIcon = true;
    this.deleteIngredientButton = false;
    this.includedIngredientIcon = true;
    this.ingredientsBottomDiv = true;
    this.optionButtonsContainer = true;
    this.printPreviewButton = true;
    this.removeMenuButton = false;
    this.orderStatusPopover = true;
    this.preparingStatus = false;
    this.packedStatus = false;
    this.inTransitStatus = true;
    this.deliveredStatus = true;
    this.cancelledStatus = true;
  }

  if (orderStatus === 'In Transit') {
    this.orderStatusColor = 'tertiary';
    this.orderStatusButton = true;
    this.orderStatusBadge = false;
    this.excludedIngredientIcon = true;
    this.deleteIngredientButton = false;
    this.includedIngredientIcon = true;
    this.ingredientsBottomDiv = false;
    this.optionButtonsContainer = true;
    this.printPreviewButton = true;
    this.removeMenuButton = false;
    this.orderStatusPopover = true;
    this.preparingStatus = false;
    this.packedStatus = false;
    this.inTransitStatus = false;
    this.deliveredStatus = true;
    this.cancelledStatus = true;
  }

  if (orderStatus === 'Delivered') {
    this.orderStatusColor = 'success';
    this.orderStatusButton = false;
    this.orderStatusBadge = true;
    this.excludedIngredientIcon = true;
    this.deleteIngredientButton = false;
    this.includedIngredientIcon = true;
    this.ingredientsBottomDiv = false;
    this.optionButtonsContainer = true;
    this.printPreviewButton = true;
    this.removeMenuButton = false;
    this.orderStatusPopover = false;
    this.preparingStatus = false;
    this.packedStatus = false;
    this.inTransitStatus = false;
    this.deliveredStatus = false;
    this.cancelledStatus = false;

  }

  if (orderStatus === 'Cancelled') {
    this.orderStatusColor = 'primary';
    this.orderStatusButton = false;
    this.orderStatusBadge = true;
    this.excludedIngredientIcon = true;
    this.deleteIngredientButton = false;
    this.includedIngredientIcon = true;
    this.ingredientsBottomDiv = false;
    this.optionButtonsContainer = false;
    this.printPreviewButton = false;
    this.removeMenuButton = false;
    this.orderStatusPopover = false;
    this.preparingStatus = false;
    this.packedStatus = false;
    this.inTransitStatus = false;
    this.deliveredStatus = false;
    this.cancelledStatus = false;

  }
}
}
