import {Requisito} from './requisito';

export interface ProInscripcionDto {
  aceptado: any
  apellido: string
  callePrincipalResidencia: string
  calleSecundariaResidencia: string
  cantonNacimiento: string
  cantonResidencia: string
  cedula: string
  ciudadTituloSegundoNivel: string
  codConvocatoria: number
  codDatosPersonales: number
  codEstudiante: number
  codInscripcion: number
  colegio: string
  correoPersonal: string
  fechaInscripcion: any
  fechaNacimiento: string
  meritoAcademicoDescripcion: string
  meritoDeportivoDescripcion: string
  nombre: string
  nombreTituloSegundoNivel: string
  numTelefCelular: string
  numeroCasa: string
  paisTituloSegundoNivel: string
  provinciaNacimiento: string
  provinciaResidencia: string
  requisitos: Requisito[];
  sexo: string
  tipoNacionalidad: string
  tipoSangre: string
}
