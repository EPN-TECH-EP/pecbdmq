import { Injectable } from '@angular/core';


@Injectable()
export class InscripcionCompletaDto {


  public codDatoPersonal: number;
  public cedula: number;
  public apellido: string;
  public nombre: string;
  public correoPersonal: string;
  public sexo: string;
  public area: string;
  public fechaNacimiento: string;
  public numTelefCelular: string;
  public numTelefConvencional: string;
  public tipoNacionalidad: string;
  public codProvinciaNacimiento: string;
  public codCantonNacimiento: string;
  public codProvinciaResidencia: string;
  public codCantonResidencia: string;
  //public direccionActual: string;
  public callePrincipalResidencia: string;
  public calleSecundariaResidencia: string;
  public numeroCasa: string;
  public paisTituloSegundoNivel: string;
  public ciudadTituloSegundoNivel: string;
  public colegio: string;
  public nombreTituloSegundoNivel: string;
  public meritoAcademicoDescripcion: string;
  public meritoDeportivoDescripcion: string;

  public estado: string;
  public fechaInscripcion: string;

  public nombreTituloTercerNivel?: string;
  public paisTituloTercerNivel?: string;
  public ciudadTituloTercerNivel?: string;
  public institucionTituloTercerNivel?: string;

}


