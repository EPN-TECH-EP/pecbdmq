import { Paralelo } from "../admin/paralelo";

export interface Estudiante {
  codEstudiante: number;
  codUnico: string;
  nombre: string;
  apellido: string;
  cedula: string;
  correo: string;
  telefono: string;
  codDatosPersonales: number;
  codUsuario: number;
  paralelo?: Paralelo;
}

export const ESTUDIANTE_VACIO: Estudiante = {
  codEstudiante: null,
  codUnico: null,
  nombre: null,
  apellido: null,
  cedula: null,
  correo: null,
  telefono: null,
  codDatosPersonales: null,
  codUsuario: null,
  paralelo: null
}

export interface NotaPorEstudiante {
  codNota: number;
  codUnicoEstudiante: string;
  nombreCompleto: string;
  cedula: string;
  notaFinal: number;
  notaDisciplina: number;
  notaSupletorio: number;
  codParalelo: number;
  nombreParalelo: string;
}

export interface NotaDisciplina {
  codEstudiante: number;
  codUnico: string;
  nombreCompleto: string;
  cedula: string;
  promedioDisciplinaOficialSemana: number;
  codParalelo: number;
}

