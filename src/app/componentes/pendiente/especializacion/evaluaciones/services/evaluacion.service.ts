import { Injectable } from '@angular/core';
import { environment } from "../../../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { PreguntaTipoEvaluacion } from "./preguntas-tipo-evaluacion.service";


export interface Evaluacion {
  codEvaluacion?: number;
  codTipoEvaluacion: number;
  nombre: string;
  autor: string;
  fechaCreacion: Date;
  estado: string;
  preguntas?: PreguntaTipoEvaluacion[];
}

export interface CursoInstructorEvaluacion {
  id: {
    codCursoInstructor: number;
    codEvaluacion: number;
  },
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  crear(evaluacion: Evaluacion) {
    return this.http.post<Evaluacion>(`${ this.host }/evaluaciones`, evaluacion);
  }

  crearInstructorCursoEvaluacion(data: CursoInstructorEvaluacion){
    console.log("data",data);
    return this.http.post<CursoInstructorEvaluacion>(`${ this.host }/intructorCursoEvaluacion`, data);
  }

  existeEvaluacionCurso(codCursoInstructor: number) {
    return this.http.get<Evaluacion>(`${ this.host }/intructorCursoEvaluacion/${ codCursoInstructor }`);
  }
}
