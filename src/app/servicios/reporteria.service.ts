import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/operators";
import { environment } from '../../environments/environment';
import { ReporteRequest, ReporteResponse } from '../modelo/dto/reporte.dto';

@Injectable({ providedIn: 'root', })

export class ReporteriaService {

  private url = environment.apiUrl + '/reportes';

  constructor(private http: HttpClient) {}

  getReporte(codigo: string) {
    const params = { codigo: codigo };
    return this.http.get<ReporteResponse>(`${this.url}`, { params });
  }

  generarPdf(request: ReporteRequest) {
    return this.http.post(`${this.url}/generar-pdf`, request, {
      responseType: 'blob',
    }).pipe(
      catchError(error => {
          return throwError(() => error);
        }
      ));
  }

  generarExcel(request: ReporteRequest) {
    return this.http.post(`${this.url}/generar-excel`, request, {
      responseType: 'blob',
    }).pipe(
      catchError(error => {
          return throwError(() => error);
        }
      ));
  }
  generarMallaCurricular( fileType: string) {
    return this.http.post(`${this.url}/generarMallaCurricular/Malla-Curricular/${fileType}`, {}, {
      responseType: 'blob',
    }).pipe(
      catchError(error => {
          return throwError(() => error);
        }
      ));
  }
  generarReporteGeneral(year: number,fileType: string) {
    const params = new HttpParams().set('year', year.toString());
    return this.http.post(`${this.url}/reporteGeneral/reporteGeneral/${fileType}`, {}, {
      responseType: 'blob',
      params: params
    }).pipe(
      catchError(error => {
          return throwError(() => error);
        }
      ));
  }
  generarAntiguedades( fileType: string) {
    return this.http.post(`${this.url}/generarAntiguedades/Antiguedades/${fileType}`, {}, {
      responseType: 'blob',
    }).pipe(
      catchError(error => {
          return throwError(() => error);
        }
      ));
  }
  generarAprobadosFormacion( fileType: string) {
    return this.http.post(`${this.url}/generarReporteAprobadosReprobados/aprobadosFormacion/${fileType}`, {}, {
      responseType: 'blob',
    }).pipe(
      catchError(error => {
          return throwError(() => error);
        }
      ));
  }

  generarAprobadosEspecializacion( codCursoEsp:number,fileType: string) {
    return this.http.post(`${this.url}/generarReporteAprobadosReprobados/${codCursoEsp}/aprobadosEsp/${fileType}`, {}, {
      responseType: 'blob',
    }).pipe(
      catchError(error => {
          return throwError(() => error);
        }
      ));
  }
  generarEvaluaciones( codCursoEsp:number,fileType: string) {
    return this.http.post(`${this.url}/generarEvaluacion/${codCursoEsp}/encuestasEsp/${fileType}`, {}, {
      responseType: 'blob',
    }).pipe(
      catchError(error => {
          return throwError(() => error);
        }
      ));
  }
  generarNotaFichaPersonal( fileType: string, codEstudianteFor: number, codEstudiantePro: number) {
    return this.http.post(`${this.url}/generarNotas/${codEstudianteFor}/${codEstudiantePro}/notas/${fileType}`, {}, {
      responseType: 'blob',
    }).pipe(
      catchError(error => {
          return throwError(() => error);
        }
      ));
  }




}

