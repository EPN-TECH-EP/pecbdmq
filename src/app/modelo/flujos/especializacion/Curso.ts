import { EstadoEspecializacion } from "./EstadoEspecializacion";
import { DatoPersonal } from "../../admin/dato-personal";
import { Documento } from "../../../servicios/periodo-academico.service";
import { Requisito } from "../../admin/requisito";

export interface Curso {
  codCursoEspecializacion: number
  codAula: number
  numeroCupo: number
  fechaInicioCurso: Date
  fechaFinCurso: Date
  fechaInicioCargaNota: Date
  fechaFinCargaNota: Date
  notaMinima: number
  apruebaCreacionCurso: boolean
  codCatalogoCursos: number
  estado: string
  emailNotificacion: string
  tieneModulos: boolean

  porcentajeAceptacionCurso?: number
  codUsuarioCreacion?: number
  codUsuarioValidacion?: number
  nombre?: string
  observacionesValidacion?: string

  documentos?: Documento[]
  requisitos?: Requisito[]
  tipoCurso?: TipoCurso
  estados?: EstadoEspecializacion[]
  creadoPor?: DatoPersonal
  aprobadoPor?: DatoPersonal
}

export interface TipoCurso {
  codCatalogoCursos: number
  nombreCatalogoCurso: string
  descripcionCatalogoCurso: string
  codTipoCurso: number
  estado: string
}




