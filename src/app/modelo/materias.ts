import { Injectable } from '@angular/core';
import { Paralelo } from './paralelo/paralelo';

@Injectable()
export class Materia {
  public codMateria: number;
  public nombreMateria: string;
  public numHoras: number;
  public tipoMateria: string;
  public observacionMateria: string;
  public pesoMateria: number;
  public notaMinima: number;
  public estado: string;

 //public paralelos: number;//
 //public active: boolean;//
 // public notLocked: boolean;//

}
