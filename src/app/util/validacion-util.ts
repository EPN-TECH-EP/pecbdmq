import { NgModel } from "@angular/forms";

export class ValidacionUtil {
  // valores permitidos de tipo: 'catalogo', 'entero', 'decimal' 'alfanumerico'
  public static onInputChange(event: Event, tipo: string, nombreModel: NgModel) {
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
}
