import { Injectable } from '@angular/core';

@Injectable()
export class Ponderacion {
  public codigo: number;
  public modulo: string;
  public componente: string;
  public tiponota: string;
  public porcentajefinal: number;
  public porcentajenota: number;
  public fechaInicioVigencia: Date;
  public fechaFinVigencia: Date;
  public periodo: string;
  public estado: string;
}
