import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { defer, Observable, of } from "rxjs";
import { Paralelo } from "../../modelo/admin/paralelo";
import { MateriaFormacion } from "./materias-formacion.service";
import { Estudiante } from "../../modelo/flujos/Estudiante";

export interface EstudiantesPorParalelo {
  paralelos: Paralelo[];
  estudiantes: Estudiante[];
}

export interface MateriaPorInstrutor {
  codMateria: number;
  nombre: string;
  codEjeMateria: number;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistroNotasService {

  private host = environment.apiUrl


  constructor(private http: HttpClient) {
  }


  listarMateriasSiEsCoordinador(codInstructor: number) {
    return this.http.post<MateriaPorInstrutor[]>(`${ this.host }/materia/coordinador?codInstructor=${ codInstructor }`, {});
  }

}
