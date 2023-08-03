import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { NotaMateriaPorEstudiante } from "./estudiante.service";
import { MateriaPorInstructor } from "./registro-notas.service";
import { Instructor } from "../../modelo/flujos/instructor";

export interface ApelacionRequest {
  codNotaFormacion: number;
  observacionEstudiante: string;
}

export interface ApelacionResponse {
  codApelacion: number,
  fechaSolicitud: Date,
  observacionEstudiante: string,
  observacionInstructor: string,
  aprobacion: boolean,
  notaActual: number,
  notaNueva: number,
  estado: string,
  codNotaFormacion: number,
  codNotaProfesionalizacion: number
  nombreMateria?: string,
  nombreEstudiante?: string,
  codEstudiante?: number,
}


@Injectable({
  providedIn: 'root'
})

export class ApelacionesService {

  private host = environment.apiUrl;
  materia: MateriaPorInstructor;
  instructor: Instructor;

  constructor(private http: HttpClient) {
    this.materia = null;
  }

  crear(apelacion: ApelacionRequest) {
    return this.http.post(`${ this.host }/apelacion/crear`, apelacion);
  }

  listarPorEstudiante(codEstudiante: number) {
    return this.http.get<ApelacionResponse[]>(`${ this.host }/apelacion/listarByEstudiante/${ codEstudiante }`);
  }

  getMateriaByCodNotaYCodEstudiante(codNotaFormacion: number, codEstudiante: number) {
    const params: HttpParams = new HttpParams()
      .set('codEstudiante', codEstudiante.toString())
      .set('codNotaFormacion', codNotaFormacion.toString());
    return this.http.get<NotaMateriaPorEstudiante>(`${ this.host }/notasFormacion/listarMateriaWithCoordinador`, { params });
  }

  listarPorMateria(codMateria: number) {
    return this.http.get<ApelacionResponse[]>(`${ this.host }/apelacion/apelacionesPorMateria/${ codMateria }`);
  }

  actualizar(apelacion: ApelacionResponse) {
    return this.http.put(`${ this.host }/apelacion/${ apelacion.codApelacion }`, apelacion);

  }
}
