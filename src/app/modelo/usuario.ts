import { Injectable } from '@angular/core';
import { DatoPersonal } from './admin/dato-personal';

@Injectable()
export class Usuario {
  public codUsuario: string;
  public codModulo: string;
  //public nombres: string;
  //public apellidos: string;
  public nombreUsuario: string;
  //public email: string;
  public fechaUltimoLogin: Date;
  public fechaUltimoLoginMostrar: Date;
  public fechaRegistro: Date;
  //public urlImagenPerfil: string;
  public active: boolean;
  public notLocked: boolean;
  public codDatosPersonales: DatoPersonal;

  constructor(){
    this.codDatosPersonales = new DatoPersonal(null,null,null,null,null,null,null,null,null,null,null,null,null/*,null,null*/);
  }


}
