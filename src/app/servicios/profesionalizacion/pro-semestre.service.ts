import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse,} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Semestre} from '../../modelo/admin/semestre';
import {ProPeriodo} from "../../modelo/admin/profesionalizacion/pro-periodo";

@Injectable({
  providedIn: 'root'
})
export class ProSemestreService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getSemestre(): Observable<Semestre[]> {
    return this.http.get<Semestre[]>(`${this.host}/semestre/listar`);
  }

  public crearSemestre(semestre: Semestre): Observable<HttpResponse<Semestre>> {
    return this.http.post<Semestre>(`${this.host}/semestre/crear`, semestre, {observe: 'response'});
  }

  public actualizarSemestre(semestre: Semestre, codSemestre: any): Observable<HttpResponse<Semestre>> {
    return this.http.put<Semestre>(`${this.host}/semestre/${codSemestre}`, semestre, {observe: 'response'});
  }

  public eliminarSemestre(codSemestre: any): Observable<string> {
    return this.http.delete<any>(`${this.host}/semestre/${codSemestre}`);
  }

  public mostrar1Semestre(codSemestre: any): Observable<string> {
    return this.http.get<any>(`${this.host}/semestre/${codSemestre}`);
  }
  public listar(): Observable<Semestre[]> {
    return this.http.get<Semestre[]>(`${this.host}/semestre/listar`);
  }

}
