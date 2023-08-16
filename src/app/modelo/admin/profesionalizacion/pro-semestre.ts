import { Injectable } from '@angular/core';

@Injectable()
export class ProSemestre {
  public codPeriodoSemestre?: number;
  public codigoSemestre?: number;
  public codSemestre?: number;
  public nombreSemestre?: string;
  public fechaInicio?: Date;
  public fechaFin?: Date;
  public estado?: string
}
