import { Injectable } from '@angular/core';

@Injectable()
export class ProNota {
  estado: string;
  codNotaProfesionalizacion?: number;
  codEstudianteSemestreMateriaParalelo?: number;
  notaParcial1: number;
  notaParcial2: number;
  notaPractica: number;
  notaAsistencia: number;
  codInstructor?: number;
  codMateria?: number;
  codEstudiante?: number;
  codSemestre?: number;
  notaMinima?: number;
  pesoMateria?: number;
  numeroHoras?: number;
  notaMateria?: number;
  notaPonderacion?: number;
  notaDisciplina?: number;
  notaSupletorio?: number;
}
