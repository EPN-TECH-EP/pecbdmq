import { Injectable } from '@angular/core';

@Injectable()
export class MateriaSemestre {
  public codigo?: number;
  public codigoEstudiante?: number;
  public codigoSemestre?: number; // TODO fix back
  public codigoMateria: number; // TODO fix back
  public estado?: string;
}
