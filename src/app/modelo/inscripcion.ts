import { Injectable } from '@angular/core';


@Injectable()
export class Inscripcion {
  public codigo: number;
  public cedula: number;
  public apellidos: string;
  public nombres: string;
  public email: string;
  public sexo: string;
  public fechaNacimiento: string;
  public telCelular: string;
  public telConvencional: string;
  public nacionalidad: string;
  public provinciaNacimiento: string;
  public cantonNacimiento: string;
  public provinciaResidencia: string;
  public cantonResidencia: string;
  public direccionActual: string;
  public callePrincipal: string;
  public calleSecundaria: string;
  public numeroCasa: string;
  public paisTitulo: string;
  public ciudadTitulo: string;
  public colegioTitulo: string;
  public nombreTitulo: string;
  public meritoAcademico: string;
  public meritoDeportivo: string;

  public estado: string;
  public fechaInscripcion: string;

}
