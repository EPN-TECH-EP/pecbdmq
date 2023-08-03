import { EstadoEspecializacion } from "./EstadoEspecializacion";
import { DatoPersonal } from "../../admin/dato-personal";

export interface Curso {
  codCursoEspecializacion: number
  codAula: number
  numeroCupo: number
  fechaInicioCurso: string
  fechaFinCurso: string
  fechaInicioCargaNota: string
  fechaFinCargaNota: string
  notaMinima: number
  apruebaCreacionCurso: boolean
  codCatalogoCursos: number
  estado: string
  emailNotificacion: string
  tieneModulos: any

  nombre?: string
  documentos?: any[]
  requisitos?: any[]
  tipoCurso?: TipoCurso
  estados?: EstadoEspecializacion[]
  creadoPor?: DatoPersonal;
  aprobadoPor?: DatoPersonal;
}

export interface TipoCurso {
  codCatalogoCursos: number
  nombreCatalogoCurso: string
  descripcionCatalogoCurso: string
  codTipoCurso: number
  estado: string
}
