 import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
 import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs';
 import { environment } from 'src/environments/environment';
import { TipoCurso } from 'src/app/modelo/flujos/especializacion/tipo-curso';

 @Injectable({
   providedIn: 'root'
 })
 export class TipoCursoService {
   private host = environment.apiUrl;

   constructor(private http: HttpClient) { }

   public get(): Observable<TipoCurso[]> {
     return this.http.get<TipoCurso[]>(`${this.host}/tipoCurso/listar`);
   }

   public crear(tipoCurso: TipoCurso): Observable<HttpResponse< TipoCurso>> {
     return this.http.post<TipoCurso>(`${this.host}/tipoCurso/crear`, tipoCurso, { observe: 'response' });
   }

   public actualizar(tipoCurso: TipoCurso): Observable<HttpResponse<TipoCurso>> {
     return this.http.put<TipoCurso>(`${this.host}/tipoCurso/${tipoCurso.codTipoCurso}`, tipoCurso, { observe: 'response' });
   }

   public eliminar(codigo: any): Observable<string> {
     return this.http.delete<any>(`${this.host}/tipoCurso/${codigo}`);
   }

   public mostrar(codigo: any): Observable<string> {
      return this.http.get<any>(`${this.host}/tipoCurso/${codigo}`);
   }
 }
