import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ArchivoService } from "../archivo.service";
import { Observable } from "rxjs";
import { Instructor } from "../../modelo/flujos/instructor";
import { Paralelo } from "../../modelo/admin/paralelo";
import { Aula } from "../../modelo/admin/aula";

export interface MateriaFormacion {
  codMateriaFormacion: number;
  nombreMateria: string;
  nombreEjeMateria: string;
   coordinador: Instructor;
  asistentes: Instructor[];
  instructores: Instructor[];
  paralelo?: Paralelo;
  nombreParalelo?: string;
  aula: Aula;
}



export interface MateriaFormacionRequest {
  codMateria: number;
  codCoordinador: number;
  codAula: number;
  codAsistente: number[];
  codInstructor: number[];
  codParalelo: number;
}


@Injectable({
  providedIn: 'root'
})

export class MateriasFormacionService {

  private host = environment.apiUrl

  constructor(private http: HttpClient, private archivoService: ArchivoService) {
  }

  listar(): Observable<MateriaFormacion[]>{
    return this.http.get<MateriaFormacion[]>(`${ this.host }/instructorMateriaParalelo/listarRead`);
  }

  crear(materia: MateriaFormacionRequest): Observable<MateriaFormacionRequest> {
    return this.http.post<MateriaFormacionRequest>(`${ this.host }/instructorMateriaParalelo/asignar`, materia);
  }

}
