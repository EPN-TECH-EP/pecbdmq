import { Semestre } from 'src/app/modelo/admin/semestre';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent, } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CustomHttpResponse } from '../modelo/admin/custom-http-response';
import { Periodo } from '../modelo/admin/periodo-academico';

export interface PeriodoAcademico {
  codigo: number
  moduloEstados: number
  fechaInicio: string
  fechaFin: any
  estado: string
  descripcion: string
  documentos: Documento[]
}

export interface Documento {
  codDocumento: number
  tipo: any
  descripcion: any
  nombre: string
  observaciones: any
  ruta: string
  estado: string
  autorizacion: any
  estadoValidacion: any
}


@Injectable({ providedIn: 'root', })

export class PeriodoAcademicoService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getPeriodo(): Observable<Periodo[]> {
    return this.http.get<Periodo[]>(`${ this.host }/periodoacademico/listarActivos`);
  }

  public getEstadoPeriodoAcademico(): Observable<Periodo[]> {
    return this.http.get<Periodo[]>(`${ this.host }/periodoacademico/validaestado`);
  }

  public registroPeriodoAcademico(periodo: Periodo): Observable<HttpResponse<Periodo>> {
    return this.http.post<Periodo>(`${ this.host }/periodoacademico/crear`, periodo, { observe: 'response' });
  }

  public eliminarPeriodoAcademico(codigo: number): Observable<string> {
    return this.http.delete<string>(`${ this.host }/periodoacademico/${ codigo }`);
  }

  public actualizarPeriodoAcademico(periodo: Periodo, codigo: any): Observable<HttpResponse<Periodo>> {
    return this.http.put<Periodo>(`${ this.host }/periodoacademico/${ codigo }`, periodo, { observe: 'response' });
  }

  // public obtener1PeriodoAcademico(codigo: number): Observable<string> {
  //   return this.http.get<string>(`${this.host}/periodoacademico/${codigo}`);
  //   }

  listarPeriodosAcademicos() {
    return this.http.get<PeriodoAcademico[]>(`${ this.host }/periodoacademico/formacion/listar`);
  }

}
