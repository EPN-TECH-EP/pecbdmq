import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ArchivoService } from "../archivo.service";
import { InscripcionItem } from "../../modelo/flujos/formacion/inscripcion-item";
import { InscripcionCompleta } from "../../modelo/flujos/formacion/inscripcion-completa";
import { Estudiante } from "../../modelo/flujos/Estudiante";
import { Paralelo } from "../../modelo/admin/paralelo";
import { DatoPersonal } from "../../modelo/admin/dato-personal";
import {
  NotasEstudiantesComponent
} from "../../componentes/flujos/formacion/formacion-academica/notas-estudiantes/notas-estudiantes.component";
import { FaltaPeriodo } from "../../modelo/flujos/formacion/api-bomberos/faltaPeriodo";


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

export interface NotaMateriaPorEstudiante {
  codNotaFormacion: number;
  nombreMateria: string;
  notaMateria: number;
  notaDisciplina: number;
  notaSupletorio: number;
  codInstructor: number;
  nombreCompletoInstructor: string;
}

export interface FaltaEstudiante {
  codSancion: number;
  codDocumento: number;
  codEstudiante: number;
  fechaSancion: Date;
  observacionSancion: string;
  estado: string;
  codInstructor: number;
  codFaltaPeriodo: number;
  codFaltaSemestre: number;
  codFaltaCurso: number;
  faltaPeriodo?: FaltaPeriodo
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

  registrarEstudiantesEnTablaNotas() {
    return this.http.get(`${ this.host }/notasFormacion/registroEstudiantesNotas`);
  }

  generarListaDeAntiguedades() {
    return this.http.get(`${ this.host }/antiguedades/generaArchivosAntiguedadesFormacion`);
  }

  listarNotasPorEstudiante(idEstudiante: number) {
    const params: HttpParams = new HttpParams().set('codEstudiante', idEstudiante.toString());
    return this.http.get<NotaMateriaPorEstudiante[]>(`${ this.host }/notasFormacion/listarNotaMateriaCoordinadorByEstudiante`, { params });
  }

  crearBajaEstudiante(data: FormData) {
    return this.http.post(`${ this.host }/baja/crear`, data);
  }

  darBajaEstudiante(idEstudiante: number) {
    return this.http.post(`${ this.host }/baja/darDeBaja/${ idEstudiante }`,{});
  }

  listarEstudiantesBaja() {
    return this.http.get<Estudiante[]>(`${ this.host }/estudiante/listarBajaPA`);
  }

  sancionarEstudiante(data: FormData) {
    return this.http.post(`${ this.host }/sanciones/crear`, data);
  }

  listarSancionesPorEstudiante(idEstudiante: number) {
    return this.http.get<FaltaEstudiante[]>(`${ this.host }/sanciones/estudiante/${ idEstudiante }`);
  }

  descargarDocumentoAntiguedades() {
    return this.http.get(`${ this.host }/antiguedades/descargarArchivo?extension=pdf`, { responseType: 'blob' });
  }

  // creación de estudiantes que aprobaron etapa de pruebas de formación
  // url estudiante/crearEstudiantes
  // POST
  // params: ninguno
  // retorna: OK o HttpErrorResponse
  crearEstudiantes() {
    return this.http.post(`${ this.host }/estudiante/crearEstudiantes`, {});
  }

  esEstudiante(nombreUsuario: string) {
    return this.http.post<Estudiante>(`${ this.host }/estudiante/esEstudiante/${ nombreUsuario }`, {});
  }

  getEstudianteByUser(user: number) {
    return this.http.get<Estudiante>(`${ this.host }/estudiante/byUser?codUsuario=${ user }`);
  }
  
}
