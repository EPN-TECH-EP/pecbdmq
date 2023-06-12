import { Injectable } from '@angular/core';

@Injectable()
export class Ponderacion {
  public codPonderacion: number;
  public codModulo: number;
  public codPeriodoAcademico: number;
  public codComponenteNota: number;
  public codTipoNota: number;
  public porcentajefinalponderacion: number;
  public porcentajenotamateria: number;
  public fechainiciovigencia: Date;
  public fechafinvigencia: Date;
  public estado: string;
}

