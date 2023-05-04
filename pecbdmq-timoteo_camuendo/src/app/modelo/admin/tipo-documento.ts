import { Injectable } from '@angular/core';

@Injectable()
export class TipoDocumento {
  public codigoDocumento: number;
  public tipoDocumento: string;
  public estado: string;
}
