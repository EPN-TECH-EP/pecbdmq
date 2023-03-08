import { Injectable } from '@angular/core';
import {HttpClient,HttpResponse, HttpErrorResponse, HttpEvent,} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Semestre } from '../modelo/semestre';
import { SemestreTbl } from '../modelo/util/semestre-tbl';
@Injectable({
  providedIn: 'root'
})
export class SemestreService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getSemestre(): Observable<Semestre[]> {
    return this.http.get<Semestre[]>(`${this.host}/semestre/listar`);
  }

  public crearSemestre(semestre: Semestre): Observable<HttpResponse< Semestre>> {
    return this.http.post<Semestre>(`${this.host}/semestre/crear`, semestre, { observe: 'response' });
  }
  public actualizarSemestre(semestre: Semestre,  codSemestre :any): Observable<HttpResponse<Semestre>> {
    return this.http.put<Semestre>(`${this.host}/semestre/${codSemestre}`, semestre, { observe: 'response' });
  }

  public eliminarSemestre(codSemestre: any): Observable<string> {
    return this.http.delete<any>(`${this.host}/semestre/${codSemestre}`);
    }


  }
