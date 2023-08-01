import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Curso, TipoCurso } from "../../modelo/flujos/especializacion/Curso";
import { EstadoEspecializacion } from "../../modelo/flujos/especializacion/EstadoEspecializacion";

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
    return this.http.get<Curso[]>(`${ this.host }/curso/listarPorEstado`, { params });
  }

  getTipoCurso(codCatalogoCurso: number) {
    return this.http.get<TipoCurso>(`${ this.host }/catalogoCurso/${ codCatalogoCurso }`);
  }

  listarEstadosPorCurso(codTipoCurso: number) {
    return this.http.get<EstadoEspecializacion[]>(`${ this.host }/cursoEstado/listarEstados/${ codTipoCurso }`);
  }

  obtenerEstadoActual(codCurso: number) {
    return this.http.get<EstadoEspecializacion>(`${ this.host }/cursoEstado/activo/${ codCurso }`);
  }

  actualizarEstadoCurso(codCurso: number, codEstado: number) {
    return this.http.put(`${ this.host }/cursoEstado/${ codCurso }/${ codEstado }`, {});
  }

}
