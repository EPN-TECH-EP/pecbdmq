import { Injectable } from '@angular/core';

@Injectable()
export class Periodo {
  public codigo: number;
  public moduloEstados?: number;
  public fechaInicio: Date;
  public fechaFin: Date;
  public estado: string;
  public descripcion: string;

}
