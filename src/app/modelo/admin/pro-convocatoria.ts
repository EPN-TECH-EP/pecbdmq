import {Requisito} from './requisito';

export interface ProConvocatoria {
  codigo?: number;
  codConvocatoria?: number;
  codPeriodoAcademico: number;
  codPeriodoEvaluacion: number;
  codigoParametro2: number;
  codigoParametro: number;
  codigoSemestre: number;
  codigoUnico: string;
  codigoUnicoConvocatoria: string;
  correo: string;
  estado: string;
  fechaActual: Date;
  fechaFin: Date;
  fechaInicio: Date;
  nombre: string;
  requisitos: Requisito[];
  codPeriodo: number;
}
