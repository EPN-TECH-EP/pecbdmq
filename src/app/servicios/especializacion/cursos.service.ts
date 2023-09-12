import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Curso, TipoCurso} from "../../modelo/flujos/especializacion/Curso";
import {EstadoEspecializacion} from "../../modelo/flujos/especializacion/EstadoEspecializacion";
import {CustomHttpResponse} from "../../modelo/admin/custom-http-response";

@Injectable({
  providedIn: 'root'
})
export class CursosService {

  private host = environment.apiUrl;

  curso: Curso;

  constructor(private http: HttpClient) {
    this.curso = null;
  }

  listarCursosPorEstado(estado: string) {
    const params: HttpParams = new HttpParams()
      .set('estado', String(estado));
    return this.http.get<Curso[]>(`${this.host}/curso/listarPorEstado`, {params});
  }

  listarCursosPorInstructorAndEstado(codUsuario: number, estado: string) {
    const params: HttpParams = new HttpParams()
      .set('codUsuario', String(codUsuario))
      .set('estado', String(estado));
    return this.http.get<Curso[]>(`${this.host}/curso/listarPorInstructorEstado`, {params});
  }

  getTipoCurso(codCatalogoCurso: number) {
    return this.http.get<TipoCurso>(`${this.host}/catalogoCurso/${codCatalogoCurso}`);
  }

  listarEstadosPorCurso(codTipoCurso: number) {
    return this.http.get<EstadoEspecializacion[]>(`${this.host}/cursoEstado/listarModuloEstados/${codTipoCurso}`);
  }

  obtenerEstadoActual(codCurso: number) {
    return this.http.get<CustomHttpResponse>(`${this.host}/cursoEstado/activo/${codCurso}`);
  }

  actualizarEstadoCurso(codCurso: number, codEstado: number) {
    return this.http.get(`${this.host}/cursoEstado/actualizarEstado/${codCurso}/${codEstado}`);
  }

  comprobarMininoEstudiantes(codCurso: number) {
    return this.http.get(`${this.host}/repositorioCurso/comprobarMinimo&GenerarDocumento/${codCurso}`);
  }

  obtenerCurso(codigo: number) {
    return this.http.get<Curso>(`${this.host}/curso/${codigo}`);
  }

  aprobar(aprobado: boolean, observaciones: string, codUsuarioAprueba: number, codCurso: number) {
    const data = {
      aprueba: aprobado,
      observaciones: observaciones,
      codUsuarioAprueba: codUsuarioAprueba
    }
    return this.http.put(`${this.host}/curso/validar/${codCurso}`, data);
  }

  generarListaAprobados(codCursoEspecializacion: number) {
    return this.http.get(`${this.host}/antiguedades/generaArchivosAntiguedadesEspecializacion/${codCursoEspecializacion}`);
  }

  reactivarCurso(codCurso: number) {
    return this.http.get(`${this.host}/curso/reactivar/${codCurso}`);
  }

}
