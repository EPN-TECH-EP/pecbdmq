import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ArchivoService } from "../archivo.service";
import { InscripcionItem } from "../../modelo/flujos/formacion/inscripcion-item";
import { InscripcionCompleta } from "../../modelo/flujos/formacion/inscripcion-completa";
import { Estudiante } from "../../modelo/flujos/Estudiante";
import { Paralelo } from "../../modelo/admin/paralelo";
import { DatoPersonal } from "../../modelo/admin/dato-personal";
import {
  NotasEstudiantesComponent
} from "../../componentes/flujos/formacion/formacion-academica/notas-estudiantes/notas-estudiantes.component";


export interface EstudianteParaleloRequest {
  lista: {
    codUnico: string;
    nombre: string;
    cedula: string;
    telefono: string;
  }[],
  codParalelo: number;
}

export interface NotasFormacion {
  codNotaFormacionFinal: number;
  codEstudiante: number;
  codPeriodoAcademico: number;
  promedioDisciplinaInstructor: number;
  promedioDisciplinaOficialSemana: number;
  promedioAcademico: number;
  notaFinal: number;
  realizoEncuesta: boolean;
  promedioDisciplinaFinal: number;
  ponderacionAcademica: number;
  ponderacionDisciplina: number;
  puntajeSancion: number;
}

export interface EstudianteNota {
  datoPersonal: DatoPersonal;
  notasFormacionFinal: NotasFormacion;
}

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  private host = environment.apiUrl


  constructor(private http: HttpClient) {
  }

  listar() {
    return this.http.get<Estudiante[]>(`${ this.host }/estudiante/listarPA`);
  }

  getEstudianteById(idEstudiante: number) {
    return this.http.get<Estudiante>(`${ this.host }/estudiantes/${ idEstudiante }`);
  }

  asignarEstudianteMateriaParalelo(request: EstudianteParaleloRequest) {
    return this.http.post(`${ this.host }/estudianteMateriaParalelo/asignar`, request);
  }

  listarParalelosActivos() {
    return this.http.get<Paralelo[]>(`${ this.host }/paralelo/listarPA`);
  }

  listarNotas() {
    return this.http.get<EstudianteNota[]>(`${ this.host }/notasFormacion/listarPA`);
  }
}
