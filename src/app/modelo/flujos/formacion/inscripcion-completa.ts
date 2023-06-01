import { Injectable } from '@angular/core';
import { DocumentoFormacion } from './documento';


export interface InscripcionCompleta {


apellido:                   string;
  callePrincipalResidencia:   string;
  calleSecundariaResidencia:  string;
  cantonNacimiento:           string;
  cantonResidencia:           string;
  cedula:                     string;
  ciudadTituloSegundonivel:   string;
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
  nombreTituloSegundonivel:   string;
  numTelefCelular:            string;
  numeroCasa:                 string;
  paisTituloSegundonivel:     string;
  provinciaNacimiento:        string;
  provinciaResidencia:        string;
  sexo:                       string;
  tipoNacionalidad:           string;
  tipoSangre:                 string;
}
