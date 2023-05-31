import {Injectable} from '@angular/core';

@Injectable()
export class ModuloEstado {
  public codigo: number;
  public estadoCatalogo: string;
  public estado: string;
  public orden: number;
  public modulo: string;
  public estadoActual?: string;
}

