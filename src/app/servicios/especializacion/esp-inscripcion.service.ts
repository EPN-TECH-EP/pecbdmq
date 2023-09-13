import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { DatoPersonal } from "../../modelo/admin/dato-personal";
import { Estudiante } from "../../modelo/flujos/Estudiante";
import { InscripcionEsp } from '../../modelo/flujos/especializacion/inscripcion-esp';
import { InscripcionCompletaEsp } from '../../modelo/flujos/especializacion/inscripcion-completa-esp';
import { ValidacionRequisitoEsp } from '../../modelo/flujos/especializacion/requisito';
import {InscripcionDatosEspecializacion} from "../../modelo/flujos/especializacion/inscripcion-datos-esp";

export interface PostulanteEspecializacion {
  datoPersonal: DatoPersonal;
  estudiante: Estudiante;
  esCiudadano: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EspInscripcionService {

  idInscripcion: number | null

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.idInscripcion = null
  }

  obtenerDatosDelPostulante(cedula: string, codCurso: number) {
    return this.http.get<PostulanteEspecializacion>(`${ this.host }/inscripcionEsp/informacion/${ cedula }/curso/${ codCurso }`);
  }

  // obtener lista de inscritos por curso
  // endpoint: inscripcionEsp/inscripcionesVaidas/{codCurso}
  obtenerInscritosVaidosPorCurso(codCurso: number) {
    return this.http.get<InscripcionDatosEspecializacion[]>(`${ this.host }/inscripcionEsp/inscripcionesValidas/${ codCurso }`);
  }

  guardarDatos(datoPersonal: DatoPersonal) {
    return this.http.put<PostulanteEspecializacion>(`${ this.host }/inscripcionEsp/colocarCorreo`, datoPersonal);
  }

  confirmarInscripcion(form: FormData) {
    return this.http.post(`${this.host}/inscripcionEsp/crearFully`, form);
  }

  listarInscripcionesByIdCurso(idCurso: number) {
    const params = {page: '0', size: '50'}
    return this.http.get<InscripcionEsp[]>(`${this.host}/inscripcionEsp/listarPorCurso/${idCurso}`, {params});
  }

  listarInscripcionesByIdCursoAndIdUsuario(idCurso: number, idUsuario: number) {
    const params = {page: '0', size: '50'}
    return this.http.get<InscripcionEsp[]>(`${this.host}/inscripcionEsp/listarPorCurso/${idCurso}/usuario/${idUsuario}`, {params});
  }

  asignarValidador(idInscripcion: number, idUsuario: number) {
    return this.http.put<InscripcionEsp>(`${this.host}/inscripcionEsp/${idInscripcion}/asignarDelegado/${idUsuario}`, {});
  }

  getInscripcion(idInscripcion: number) {
    return this.http.get<InscripcionCompletaEsp>(`${this.host}/inscripcionEsp/${idInscripcion}`);
  }

  listarRequisitos(idInscripcion: number) {
    return this.http.get<ValidacionRequisitoEsp[]>(`${this.host}/inscripcionEsp/requisitos/${idInscripcion}`);
  }

  guardarRequisitos(requisitos: ValidacionRequisitoEsp[]) {
    return this.http.put<ValidacionRequisitoEsp[]>(`${this.host}/inscripcionEsp/validacionRequisitos`, requisitos);
  }

}
