 import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
 import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs';
 import { CatalogoCurso } from '../../modelo/flujos/especializacion/catalogo-curso';
 import { environment } from 'src/environments/environment';

 @Injectable({
   providedIn: 'root'
 })
 export class CatalogoCursoService {
   private host = environment.apiUrl;

   constructor(private http: HttpClient) { }

   public get(): Observable<CatalogoCurso[]> {
     return this.http.get<CatalogoCurso[]>(`${this.host}/catalogoCurso/listar`);
   }

   public getPorTipoCurso(codigoTipoCurso: number): Observable<CatalogoCurso[]> {
    const params = new HttpParams().set('codigoTipoCurso', codigoTipoCurso);
    const options = { params: params };
    return this.http.get<CatalogoCurso[]>(`${this.host}/catalogoCurso/listarPorTipoCurso`, options);
   }

   public crear(catalogoCurso: CatalogoCurso): Observable<HttpResponse< CatalogoCurso>> {
     return this.http.post<CatalogoCurso>(`${this.host}/catalogoCurso/crear`, catalogoCurso, { observe: 'response' });
   }

   public actualizar(catalogoCurso: CatalogoCurso): Observable<HttpResponse<CatalogoCurso>> {
     return this.http.put<CatalogoCurso>(`${this.host}/catalogoCurso/${catalogoCurso.codCatalogoCursos}`, catalogoCurso, { observe: 'response' });
   }

   public eliminar(codigo: any): Observable<string> {
     return this.http.delete<any>(`${this.host}/catalogoCurso/${codigo}`);
   }

   public mostrar(codigo: any): Observable<string> {
      return this.http.get<any>(`${this.host}/catalogoCurso/${codigo}`);
   }
 }
