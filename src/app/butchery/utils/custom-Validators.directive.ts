/* eslint-disable quote-props */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/quotes */
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function hasItemIdValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: boolean} | null => {
    if (control.value.itemId === undefined) {
      return {'idUndefined': true};
    }
    return null;
  };
}

export function hasUomIdValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: boolean} | null => {
    if (control.value.uomId === undefined) {
      return {'idUndefined': true};
    }
    return null;
  };
}
