export interface PruebaDetalle {
  codPruebaDetalle: number;
  descripcionPrueba: string;
  fechaInicio: Date;
  fechaFin: Date;
  hora: string;
  estado: string;
  codPeriodoAcademico: number;
  codCursoEspecializacion: number;
  codSubtipoPrueba: number;
  ordenTipoPrueba: number;
  puntajeMinimo: number;
  puntajeMaximo: number;
  tienePuntaje: boolean;
}
