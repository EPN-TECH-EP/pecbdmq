import {DocumentoFormacion} from "../formacion/documento";

export interface ProInscripcionDto {
  apellido: string;
  callePrincipalResidencia: string;
  calleSecundariaResidencia: string;
  cantonNacimiento: string;
  cantonResidencia: string;
  codInscripcion: number;
  cedula: string;
  ciudadTituloSegundoNivel: string;
  codDatosPersonales: number;
  codPostulante: number;
  colegio: string;
  documentos: DocumentoFormacion[];
  edadPostulacion: number;
  fechaNacimiento: Date;
  fechaInscripcion: Date;
  fechaPostulacion: Date;
  idPostulante: string;
  meritoAcademicoDescripcion: string;
  meritoDeportivoDescripcion: string;
  nombre: string;
  nombreTituloSegundoNivel: string;
  numTelefCelular: string;
  numeroCasa: string;
  paisTituloSegundoNivel: string;
  provinciaNacimiento: string;
  provinciaResidencia: string;
  sexo: string;
  tipoNacionalidad: string;
  tipoSangre: string;
}

export interface ProInscripcionCreateUpdateDto {
  codInscripcion: number
  codEstudiante: number
  codConvocatoria: number
  adjunto: string
  fechaInscripcion: string
  aceptado: boolean,
  email: string
}
