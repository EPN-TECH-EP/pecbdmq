import { Injectable } from '@angular/core';

@Injectable()
export class Aula {
  public codAula: number;
  public nombreAula: string;
  public capacidad?: number;
  public tipo?: number;
  public pcs?: string;
  public impresoras?: string;
  public internet?: string;
  public proyectores?: number;
  public instructor?: number;
  public salaOcupada?: boolean;
  public estado?: string;


  //public active: boolean;//
  // public notLocked: boolean;//

}
