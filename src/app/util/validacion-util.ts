import { NgModel } from '@angular/forms';

export class ValidacionUtil {
  // valores permitidos de tipo: 'catalogo', 'entero', 'decimal' 'alfanumerico'
  public static onInputChange(
    event: Event,
    tipo: string,
    nombreModel: NgModel
  ) {
    const input = event.target as HTMLInputElement;

    let min = input.min !== undefined ? parseInt(input.min) : 0;
    let max = input.max !== undefined ? parseInt(input.max) : -1;

    let allowedChars: RegExp;

    if (tipo === 'catalogo') {
      allowedChars = /^[a-zA-Z0-9 _\.\-\_]*$/;
    } else if (tipo === 'entero') {
      allowedChars = /^[0-9]*$/;
    } else if (tipo === 'decimal') {
      allowedChars = /^[0-9.]*$/;
    } else if (tipo === 'alfanumerico') {
      allowedChars = /^[a-zA-Z0-9]*$/;
    } else {
      allowedChars = /^[_]*$/;
    }

    let newValue = '';
    for (let i = 0; i < input.value.length; i++) {
      if (allowedChars.test(input.value[i])) {
        newValue += input.value[i];
      }
    }
    input.value = newValue;

    // validación rangos numéricos
    if (tipo === 'entero' || tipo === 'decimal') {
      let value = parseInt(input.value);
      if (value < min) {
        input.value = min.toString();
      } else if (max !== -1 && value > max) {
        input.value = max.toString();
      }
    }

    nombreModel.update.emit(newValue);
  }

  public static onInputChangeNumber(input: HTMLInputElement, tipo: string) {
    // rest of the method code...
    console.log('value: ' + input.value);
  }

  // validación campos vacíos
  public static isNullOrEmpty(value: string): boolean {
    return  value === undefined || value === null 
    || ( typeof value === 'string' ? value.trim() === '' : false);
  }

  public static isNullOrEmptyObject(value: any): boolean {
    return value === undefined || value === null;
  }

  public static isNullOrEmptyArray(value: any[]): boolean {
    return value === undefined || value === null || value.length === 0;
  }

  public static isNullOrEmptyObjectArray(value: any[]): boolean {
    return (
      value === undefined ||
      value === null ||
      value.length === 0 ||
      value[0] === undefined ||
      value[0] === null
    );
  }

  public static tienePropiedadesVacías(value: any): string[] {
    let retval: string[] = [];

    if (!this.isNullOrEmptyObject(value)) {
      for (let key in value) {
        if (this.isNullOrEmpty(value[key])) {
          retval.push(key);
        }
      }
    }

    return retval;
  }
}
