import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Usuario } from "../../../modelo/admin/usuario";

@Injectable({
  providedIn: 'root'
})
export class CapacitacionExternaService {
  items: {type: string; subItems: string[]}[];

  private itemsSolicitud = new BehaviorSubject<{type: string; subItems: string[]}[]| null>(null);
  itemsSolicitud$ = this.itemsSolicitud.asObservable();


  constructor() {
    this.items = [];
  }

  exponerItemsSolicitud() {
    this.itemsSolicitud.next(this.items);
  }


  guardarEnLocalStorage() {
    // guardamos los items en el local storage
    localStorage.setItem('items', JSON.stringify(this.items));
  }

  obtenerDelLocalStorage() {
    // obtenemos los items del local storage
    const items = localStorage.getItem('items');
    if (items) {
      this.items = JSON.parse(items);
    }

  }
}
