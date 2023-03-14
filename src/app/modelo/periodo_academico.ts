import { Semestre } from './semestre';
import { Injectable } from '@angular/core';

@Injectable()
export class Periodo {
  public codigo: string;
  public modulo: string;
  public semestre?: string;
  public fechainicio: Date;
  public fechafin: Date;
  public estado: string;
  public descripcion: string;



  // public codSemestre?: Semestre;

  // constructor(){
  //   this.codSemestre = new Semestre(null,null,null);
  // }

}
