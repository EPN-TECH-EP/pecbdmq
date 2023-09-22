import { AbstractControl } from '@angular/forms';
import { map } from "rxjs/operators";
import { Usuario } from "../modelo/admin/usuario";
import { UsuarioService } from "../servicios/usuario.service";
import { HttpClient } from "@angular/common/http";

export class MyValidators {

  static validDate(control: AbstractControl) {
    const start = new Date(control.get('fechaInicio')?.value);
    const end = new Date(control.get('fechaFin')?.value);

    if (start && end && start > end) {
      return { invalid_date: true };
    }

    return null;
  }

  static onlyLetters() {
    return (control: AbstractControl) => {
      const value = control.value;
      const regex = new RegExp('^[a-zA-ZñáéíóúÑÁÉÍÓÚ _.\-\u00C0-\u00FF ]*$');

      if (!regex.test(value)) {
        console.log('invalid_letters');
        console.log(value);
        return { invalid_letters: true };
      }

      return null;
    };
  }

  static onlyNumbers() {
    return (control: AbstractControl) => {
      const value = control.value;
      const regex = new RegExp('^[0-9]*$');

      if (!regex.test(value)) {
        return { invalid_numbers: true };
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
          return digito_calculado === digito_verificador ? null : { invalid_identification: true }
        }
      }
      return { invalid_identification: true };
    }
  }

  static validAge() {
    return (control: AbstractControl) => {
      const value = control.value;
      const date = new Date(value);
      const now = new Date();
      const age = now.getFullYear() - date.getFullYear();

      if (age < 18 || age > 28) {
        return { invalid_age: true };
      }

      return null;
    };
  }

  static userNameExist(usuarioService: UsuarioService) {
    return (control: AbstractControl) => {
      const value = control.value;
      return usuarioService.buscarPorIdentificacion(value).pipe(
        map((usuario: Usuario) => {
            if (usuario) {
              return { value_found: true };
            } else {
              return null;
            }
          }
        ),
      );
    };
  }

  static emailExist(usuarioService: UsuarioService) {
    return (control: AbstractControl) => {
      const value = control.value;

      console.log(value);

      return usuarioService.buscarPorCorreo(value).pipe(
        map((usuarios: Usuario[]) => {

            console.log(usuarios);

            if (usuarios !== null && usuarios.length > 0) {
              return { value_found: true };
            } else {
              return null;
            }
          }
        ),
      );
    };
  }

  static onlyWhole() {
    return (control: AbstractControl) => {
      const value = control.value;
      const regex = new RegExp('^[0-9]*$');

      if (!regex.test(value)) {
        return { invalid_whole: true };
      }

      return null;
    }
  }
}
