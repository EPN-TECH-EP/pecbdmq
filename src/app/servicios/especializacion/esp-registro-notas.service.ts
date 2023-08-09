 import { HttpClient, HttpResponse } from '@angular/common/http';
 import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs';
import { NotaEspecializacion } from '../../modelo/flujos/especializacion/nota-especializacion';
 import { environment } from '../../../environments/environment';

 @Injectable({
   providedIn: 'root'
 })
 export class EspRegistroNotasService {
  private host = environment.apiUrl;
  private nombreServicio = 'notasEspecializacion';

  constructor(private http: HttpClient) { }

  public getByCurso(codCurso: number): Observable<NotaEspecializacion[]> {
    return this.http.get<NotaEspecializacion[]>(`${this.host}/${this.nombreServicio}/listarPorCurso/${codCurso}`);
  }

  public getById(id: number): Observable<NotaEspecializacion[]> {
  return this.http.get<NotaEspecializacion[]>(`${this.host}/${this.nombreServicio}/${id}`);
  }

  public crear(notaEspecializacion: NotaEspecializacion): Observable<HttpResponse<NotaEspecializacion>> {
    return this.http.post<NotaEspecializacion>(`${this.host}/${this.nombreServicio}`, notaEspecializacion, { observe: 'response' });
  }
 }
