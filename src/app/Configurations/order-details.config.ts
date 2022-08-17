export class OrderDetailsConfig {

  orderStatusColor: string;
  orderStatusButton: boolean;
  orderStatusBadge: boolean;
  excludedIngredientIcon: boolean;
  deleteIngredientButton: boolean;
  includedIngredientIcon: boolean;
  ingredientsBottomDiv: boolean;
  optionButtonsContainer: boolean;
  orderStatusPopover: boolean;
  preparingStatus: boolean;
  inTransitStatus: boolean;
  deliveredStatus: boolean;
  cancelledStatus: boolean;

  constructor(){
    this.orderStatusColor = 'primary';
    this.orderStatusButton = false;
    this.orderStatusBadge = false;
    this.excludedIngredientIcon = false;
    this.deleteIngredientButton = false;
    this.includedIngredientIcon = false;
    this.ingredientsBottomDiv = false;
    this.optionButtonsContainer = false;
    this.orderStatusPopover = false;
    this.preparingStatus = false;
    this.inTransitStatus = false;
    this.deliveredStatus = false;
    this.cancelledStatus = false;
  }

setParams(orderStatus: string) {
  if (orderStatus === 'Preparing') {
    this.orderStatusColor = 'warning';
    this.orderStatusButton = true;
    this.orderStatusBadge = false;
    this.excludedIngredientIcon = true;
    this.deleteIngredientButton = true;
    this.includedIngredientIcon = false;
    this.ingredientsBottomDiv = true;
    this.optionButtonsContainer = true;
    this.orderStatusPopover = true;
    this.preparingStatus = false;
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
    this.optionButtonsContainer = false;
    this.orderStatusPopover = true;
    this.preparingStatus = false;
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
    this.optionButtonsContainer = false;
    this.orderStatusPopover = false;
    this.preparingStatus = false;
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
    this.orderStatusPopover = false;
    this.preparingStatus = false;
    this.inTransitStatus = false;
    this.deliveredStatus = false;
    this.cancelledStatus = false;

  }
}
}