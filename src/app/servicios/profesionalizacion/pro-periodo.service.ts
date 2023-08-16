import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse,} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProPeriodo} from '../../modelo/admin/profesionalizacion/pro-periodo';
import {environment} from '../../../environments/environment';


@Injectable({providedIn: 'root',})

export class ProPeriodoService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public crear(semestre: ProPeriodo): Observable<HttpResponse<ProPeriodo>> {
    return this.http.post<ProPeriodo>(`${this.host}/proPeriodos/crear`, semestre, {observe: 'response'});
  }

  public listar(): Observable<ProPeriodo[]> {
    return this.http.get<ProPeriodo[]>(`${this.host}/proPeriodos/listar`);
  }

  public get(): Observable<ProPeriodo[]> {
    return this.http.get<ProPeriodo[]>(`${this.host}/proPeriodos/`);
  }

  public eliminar(codigo: number): Observable<string> {
    return this.http.delete<string>(`${this.host}/proPeriodos/${codigo}`);
  }

  public actualizar(periodo: ProPeriodo, codigo: any): Observable<HttpResponse<ProPeriodo>> {
    return this.http.put<ProPeriodo>(`${this.host}/proPeriodos/${codigo}`, periodo, {observe: 'response'});
  }

  public getByEstado(estado: string): Observable<ProPeriodo[]> {
    return this.http.get<ProPeriodo[]>(`${this.host}/proPeriodos/estado/${estado}`);
  }

}
