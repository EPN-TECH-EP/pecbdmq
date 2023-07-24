import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Instructor } from "../../modelo/flujos/instructor";
import { Paralelo } from "../../modelo/admin/paralelo";

export interface MateriaFormacionResponse {
  paralelos: Paralelo[];
  materias: MateriaFormacion[];
}

export interface MateriaFormacion {
  codMateria: number;
  nombre: string;
  nombreEje: string;
  instructores: Instructor[];
  asistentes: Instructor[];
  coordinador: Instructor;
  nombreAula: string;
  codAula: number;
  codParalelo: number;
  nombreParalelo: string;
  ponderacionMateria?: number;
  notaMinimaSupletorio?: number;
}


export interface MateriaFormacionRequest {
  codMateria: number;
  codCoordinador: number;
  codAula: number;
  codAsistentes: number[];
  codInstructores: number[];
  codParalelo: number;
}

export interface MateriaAula {
  codMateria: number;
  codAula: number;
  ponderacionMateria: number;
  notaMinimaSupletorio: number;
}

export interface MateriaAulaParaleloRequest {
  materiasAulas: MateriaAula[];
  paralelos: Paralelo[];
}

@Injectable({
  providedIn: 'root'
})

export class MateriasFormacionService {

  private host = environment.apiUrl

  // private cache: {[key: string]: HttpResponse<any>} = {};

  constructor(private http: HttpClient) {
  }

  asignarInstructores(materia: MateriaFormacionRequest): Observable<MateriaFormacionRequest> {
    return this.http.post<MateriaFormacionRequest>(`${ this.host }/instructorMateriaParalelo/asignar`, materia);
  }

  asignarMateriaParalelo(data: MateriaAulaParaleloRequest) {
    return this.http.post(`${ this.host }/materiaParalelo/asignar`, data);
  }

  listarMateriasParalelos(): Observable<MateriaFormacionResponse> {
    return this.http.get<MateriaFormacionResponse>(`${ this.host }/instructorMateriaParalelo/listarMateriasGroupByParalelos`);
  }

}
