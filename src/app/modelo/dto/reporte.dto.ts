export class ReporteRequest {
  codigoReporte: string;
  fechaInicio: Date;
  fechaFin: Date;
  codigoCurso: number;
  codigoPeriodoProfesionalizacion: number;
  codigoPeriodoFormacion: number;
}

export class ReporteResponse {
  nombre: string;
  descripcion: string;
  verFechas: boolean;
  verSelectPromocion: boolean;
  verSelectPeriodo: boolean;
  verSelectCurso: boolean;
}

export const GENERAL = {
  CIERRE_BIMESTRE: 'GENERAL_CIERRE_BIMESTRE',
  GENERAL_MALLA: 'GENERAL_MALLA',
  GENERAL_GENERAL: 'GENERAL_GENERAL',
  GENERAL_ANTIGUEDADES: 'GENERAL_ANTIGUEDADES',
}

export const FORMACION = {
  CALIFICACIONES: 'FORMACION_CALIFICACIONES',
  PROMEDIO: 'FORMACION_PROMEDIO',
  EQUIVALENCIA: 'FORMACION_EQUIVALENCIA',
  PARTICIPANTES: 'FORMACION_PARTICIPANTES',
  APROBADOS:'FORMACION_APROBADOS',
}

export const ESPECIALIZACION = {
  CALIFICACIONES: 'ESPECIALIZACION_CALIFICACIONES',
  PROMEDIO: 'ESPECIALIZACION_PROMEDIO',
  EQUIVALENCIA: 'ESPECIALIZACION_EQUIVALENCIA',
  CURSOS_TOTAL: 'ESPECIALIZACION_CURSOS_TOTAL',
  PARTICIPANTES: 'ESPECIALIZACION_PARTICIPANTES',
  APROBADOS: 'ESPECIALIZACION_APROBADOS',
  EVALUACIONES:'ESPECIALIZACION_EVALUACIONES'
}

export const PROFESIONALIZACION = {
  CALIFICACIONES: 'PROFESIONALIZACION_CALIFICACIONES',
  PROMEDIO: 'PROFESIONALIZACION_PROMEDIO',
  EQUIVALENCIA: 'PROFESIONALIZACION_EQUIVALENCIA',
  PARTICIPANTES: 'PROFESIONALIZACION_PARTICIPANTES',
}
