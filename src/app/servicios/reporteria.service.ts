import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

}

