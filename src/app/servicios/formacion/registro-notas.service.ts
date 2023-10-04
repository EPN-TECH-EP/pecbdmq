import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Paralelo } from "../../modelo/admin/paralelo";
import { NotaDisciplina, NotaPorEstudiante } from "../../modelo/flujos/Estudiante";

export interface EstudiantesPorParalelo {
  paralelos: Paralelo[];
  estudianteDatos: NotaPorEstudiante[];
}

export interface EstudiantesNotaDisciplina {
  paralelos: Paralelo[];
  estudiantesNotaDisciplina: NotaDisciplina[];
}

export interface MateriaPorInstructor {
  codMateria: number;
  nombre: string;
  codEjeMateria: number;
  estado: string;
}

export interface NotaOficialSemana {
  codEstudiante: number;
  promedioDisciplinaOficialSemana: number;
}

@Injectable({
  providedIn: 'root'
})
export class RegistroNotasService {

  private host = environment.apiUrl
  estudiante: NotaPorEstudiante;
  materia: MateriaPorInstructor;
  estudiantesPorParalelo: {paralelo: Paralelo; estudiantes: NotaPorEstudiante[]}[];


  constructor(private http: HttpClient) {
    this.estudiante  = null
    this.materia = null
    this.estudiantesPorParalelo = null
  }


  listarMateriasSiEsCoordinador(codInstructor: number) {
    return this.http.post<MateriaPorInstructor[]>(`${ this.host }/materia/coordinador?codInstructor=${ codInstructor }`, {});
  }

  listarEstudiantesPorCodMateria(codMateria: number) {
    return this.http.post<EstudiantesPorParalelo>(`${ this.host }/notasFormacion/listarEstudiantesByMateria/${ codMateria }`, {});
  }

  listarEstudiantesNotaDisciplina() {
    return this.http.get<EstudiantesNotaDisciplina>(`${ this.host }/notasFormacion/estudiantesDisciplina`);
  }

  registrarNota(codNotaEstudiante: number, nota: NotaPorEstudiante) {
    return this.http.put(`${ this.host }/notasFormacion/notas/${ codNotaEstudiante }`, nota);
  }

  registrarNotaOficialSemana(notas: NotaOficialSemana[]) {
    console.log("Lo que envia en el body", notas);
    return this.http.post(`${ this.host }/notasFormacion/disciplinaOSemana`, notas);
  }

  calcularNotasFinales() {
    return this.http.post(`${ this.host }/notasFormacion/calcularNotas`, {});
  }

  getNotaByCodNota(codNota: number) {
    return this.http.get<NotaPorEstudiante>(`${ this.host }/notasFormacion/${ codNota }`);
  }

}
