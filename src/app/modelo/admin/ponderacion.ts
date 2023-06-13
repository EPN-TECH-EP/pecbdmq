import { Injectable } from '@angular/core';

@Injectable()
export class Ponderacion {
  public codPonderacion: number;
  public codModulo: number;
  public codPeriodoAcademico: number;
  public codComponenteNota: number;
//  public codTipoNota: number;
  public porcentajeFinalPonderacion: number;
//  public porcentajeNotaMateria: number;
//  public fechaInicioVigencia: Date;
//  public fechaFinVigencia: Date;
  public estado: string;
}

