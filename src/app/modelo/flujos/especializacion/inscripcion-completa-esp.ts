import {DocumentoEspecializacion} from "./documento";

export interface InscripcionCompletaEsp {
  codInscripcion:             number;
  nombreCatalogoCurso:        string;
  apellido:                   string;
  callePrincipalResidencia:   string;
  calleSecundariaResidencia:  string;
  cantonNacimiento:           string;
  cantonResidencia:           string;
  cedula:                     string;
  ciudadTituloSegundoNivel:   string;
  codDatosPersonales:         number;
  codPostulante:              number;
  colegio:                    string;
  documentos:                 DocumentoEspecializacion[];
  edadPostulacion:            number;
  fechaNacimiento:            Date;
  fechaInscripcion:           Date;
  fechaInicioCurso:           Date;
  fechaFinCurso:              Date;
  meritoAcademicoDescripcion: string;
  meritoDeportivoDescripcion: string;
  nombre:                     string;
  nombreTituloSegundoNivel:   string;
  numTelefCelular:            string;
  numeroCasa:                 string;
  paisTituloSegundoNivel:     string;
  provinciaNacimiento:        string;
  provinciaResidencia:        string;
  sexo:                       string;
  tipoNacionalidad:           string;
  tipoSangre:                 string;
}
