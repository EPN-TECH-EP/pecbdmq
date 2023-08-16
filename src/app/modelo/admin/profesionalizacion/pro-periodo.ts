import { Injectable } from '@angular/core';

@Injectable()
export class ProPeriodo {
  public codigoPeriodo?: number;
  public nombrePeriodo?: string;
  public fechaInicio?: Date;
  public fechaFin?: Date;
  public estado?: string
}
