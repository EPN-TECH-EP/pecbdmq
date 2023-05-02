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

  static onlyLetters() {
    return (control: AbstractControl) => {
      const value = control.value;
      const regex = new RegExp('^[a-zA-Z ]*$');

      if (!regex.test(value)) {
        return {invalid_letters: true};
      }

      return null;
    };
  }

  static onlyNumbers() {
    return (control: AbstractControl) => {
      const value = control.value;
      const regex = new RegExp('^[0-9]*$');

      if (!regex.test(value)) {
        return {invalid_numbers: true};
      }

      return null;
    };
  }

  static validIdentification() {
    return (control: AbstractControl) => {
      const cedula = control.value;
      if (typeof cedula === 'string' && cedula.length === 10 && /^\d+$/.test(cedula)) {
        const digitos = cedula.split('').map(Number);
        const codigo_provincia = digitos[0] * 10 + digitos[1];

        if (codigo_provincia >= 1 && (codigo_provincia <= 24 || codigo_provincia == 30)) {
          const digito_verificador = digitos.pop();

          const digito_calculado = digitos.reduce(
            function (valorPrevio, valorActual, indice) {
              return valorPrevio - ((valorActual * (2 - indice % 2)) % 9) - ((valorActual === 9) ? 9 : 0);
            }, 1000) % 10;
          return digito_calculado === digito_verificador ? null : {invalid_identification: true}
        }
      }
      return {invalid_identification: true};
    }
  }

}