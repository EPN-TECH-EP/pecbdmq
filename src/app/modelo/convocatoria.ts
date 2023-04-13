import { Injectable } from '@angular/core';

@Injectable()
export class Convocatoria {
  public codConvocatoria: number;
  public codPeriodoEvaluacion: number;
  public codPeriodoAcademico: number;
  public nombre: string;
  public estado: string;
  public fechaInicioConvocatoria: string;
  public fechaFinConvocatoria: string;
  public horaInicioConvocatoria: string;
  public horaFinConvocatoria: string;
  public codigoUnico: number;
  public cupoHombres: number;
  public cupoMujeres: number;

}
