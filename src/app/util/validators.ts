import {AbstractControl} from '@angular/forms';

export class MyValidators {

  static validDate(control: AbstractControl) {
    const start = new Date(control.get('fechaInicio')?.value);
    const end = new Date(control.get('fechaFin')?.value);

    if (start && end && start > end) {
      return {invalid_date: true};
    }

    return null;
  }

}
