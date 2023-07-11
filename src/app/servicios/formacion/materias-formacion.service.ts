import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { ArchivoService } from "../archivo.service";
import { Observable, of } from "rxjs";
import { Instructor } from "../../modelo/flujos/instructor";
import { Paralelo } from "../../modelo/admin/paralelo";
import { Aula } from "../../modelo/admin/aula";
import { map, tap } from "rxjs/operators";

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
  private cache: {[key: string]: HttpResponse<any>} = {};

  constructor(private http: HttpClient, private archivoService: ArchivoService) {
  }

  // listar(): Observable<MateriaFormacion[]> {
  //   const cacheKey = `${ this.host }/instructorMateriaParalelo/listarRead`;
  //
  //   if (this.cache[cacheKey]) {
  //     console.log('Recuperado de caché');
  //     return of(this.cache[cacheKey].body);
  //   } else {
  //     return this.http.get<MateriaFormacion[]>(cacheKey, { observe: 'response', responseType: 'json' })
  //       .pipe(
  //         tap((res: HttpResponse<MateriaFormacion[]>) => {
  //           console.log('Almacenando en caché');
  //           this.cache[cacheKey] = res;
  //         }),
  //         map((res: HttpResponse<MateriaFormacion[]>) => res.body)
  //       );
  //   }
  // }

  crear(materia: MateriaFormacionRequest): Observable<MateriaFormacionRequest> {
    return this.http.post<MateriaFormacionRequest>(`${ this.host }/instructorMateriaParalelo/asignar`, materia);
  }

  asignarMateriaParalelo(data: MateriaAulaParaleloRequest) {
    return this.http.post(`${ this.host }/materiaParalelo/asignar`, data);
  }

  listarMateriasParalelos(): Observable<MateriaFormacionResponse> {
    return this.http.get<MateriaFormacionResponse>(`${ this.host }/materiaParalelo/listarMateriasParalelos`);
  }

}
