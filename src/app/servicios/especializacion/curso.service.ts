 import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
 import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs';
 import { environment } from 'src/environments/environment';
import { Curso } from 'src/app/modelo/flujos/especializacion/curso';

 @Injectable({
   providedIn: 'root'
 })
 export class CursoService {
   private host = environment.apiUrl;
   private nombreServicio = 'curso';

   constructor(private http: HttpClient) { }

   public get(): Observable<Curso[]> {
     return this.http.get<Curso[]>(`${this.host}/${this.nombreServicio}/listar`);
   }

   public getPorTipoCurso(codigoTipoCurso: number): Observable<Curso[]> {
    const params = new HttpParams().set('codigoTipoCurso', codigoTipoCurso);
    const options = { params: params };
    return this.http.get<Curso[]>(`${this.host}/${this.nombreServicio}/listarPorTipoCurso`, options);
   }

   public getPorCatalogoCurso(codigoCatalogoCurso: number): Observable<Curso[]> {
    const params = new HttpParams().set('codigoCatalogoCurso', codigoCatalogoCurso);
    const options = { params: params };
    return this.http.get<Curso[]>(`${this.host}/${this.nombreServicio}/listarPorCatalogoCurso`, options);
   }

   public actualizar(curso: Curso): Observable<HttpResponse<Curso>> {
     return this.http.put<Curso>(`${this.host}/catalogoCurso/${curso.codCursoEspecializacion}`, curso, { observe: 'response' });
   }

   public eliminar(codigo: any): Observable<string> {
     return this.http.delete<any>(`${this.host}/${this.nombreServicio}/${codigo}`);
   }

   public mostrar(codigo: any): Observable<string> {
      return this.http.get<any>(`${this.host}/${this.nombreServicio}/${codigo}`);
   }

   // crear curso
   // parámetros: formData: FormData
    public crear(formData: FormData): Observable<HttpResponse<Curso>> {
      return this.http.post<Curso>(`${this.host}/${this.nombreServicio}/crear`, formData, { observe: 'response' });
    }
 }
