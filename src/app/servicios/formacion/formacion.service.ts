import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomHttpResponse } from '../../modelo/admin/custom-http-response';
import { ModuloEstado } from "../../modelo/admin/modulo-estado";

export interface ComponenteNota {
  codComponenteNota: number;
  codPeriodoAcademico: number;
  estado: string;
  nombre: string;
  porcentajeComponenteNota: number;
}


@Injectable({
  providedIn: 'root',
})
export class FormacionService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getEstadosFormacion(): Observable<ModuloEstado[]> {
    return this.http.get<ModuloEstado[]>(`${ this.host }/moduloestados/bymodulo?modulo=1`);
  }

  getEstadoActual(): Observable<CustomHttpResponse> {
    return this.http.get<CustomHttpResponse>(`${ this.host }/periodoacademico/validaestado`);
  }

  actualizarEstadoActual(formData: FormData): Observable<CustomHttpResponse> {
    return this.http.post<CustomHttpResponse>(`${ this.host }/periodoacademico/actualizaEstado`, formData);
  }

  crearComponenteNota(data: {nombre: string, porcentajeComponenteNota: number}) {
    return this.http.post(`${ this.host }/componenteNota/crear`, data);
  }

  getComponentesNotaPeriodoAcademicoActivo() {
    return this.http.get<ComponenteNota[]>(`${ this.host }/componenteNota/listarPA`);
  }

  actualizarComponenteNota(data: {
    nombre: string,
    porcentajeComponenteNota: number,
    estado: string
  }, codComponenteNota: number) {
    return this.http.put(`${ this.host }/componenteNota/${ codComponenteNota }`, data);
  }

  cerrarProcesoFormacion() {
    return this.http.get<Boolean>(`${ this.host }/periodoacademico/cerrarPeriodo`);
  }

  getPeriodoAcademicoActivo() {
    return this.http.get<any>(`${ this.host }/periodoacademico/traerPeriodoActivo`);
  }

}
