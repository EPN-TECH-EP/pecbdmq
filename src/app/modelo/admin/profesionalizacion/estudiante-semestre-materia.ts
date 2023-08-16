import { Injectable } from '@angular/core';

@Injectable()
export class EstudianteSemestreMateria {
  public codEstudianteSemestreMateria?: number;
  public codEstudianteSemestre?: number;
  public codMateria?: number;
  public estado?: string;
  public estudiante?: {
    codEstudiante: number,
    codDatosPersonales: number,
    codUnicoEstudiante: string,
    estado: string
  }
}
