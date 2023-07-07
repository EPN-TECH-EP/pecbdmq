import {DocumentoFormacion} from "./documento";

export interface InscripcionCompleta {
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
  documentos:                 DocumentoFormacion[];
  edadPostulacion:            number;
  fechaNacimiento:            Date;
  fechaPostulacion:           Date;
  idPostulante:               string;
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
