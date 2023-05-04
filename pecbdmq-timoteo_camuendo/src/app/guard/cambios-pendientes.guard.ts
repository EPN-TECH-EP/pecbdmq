import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { CambiosPendientes } from '../modelo/util/cambios-pendientes';


@Injectable({
  providedIn: 'root'
})
export class CambiosPendientesGuard implements CanDeactivate<CambiosPendientes> {
  canDeactivate(component: CambiosPendientes): Observable<boolean> | Promise<boolean> | boolean {

    console.log(component);

    if (component.cambiosPendientes()) {
      return confirm('Existen cambios pendientes. ¿Confirma que desea salir de la página actual?');
    }
    return true;
  }
}
