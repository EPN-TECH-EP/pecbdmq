 import { CatalogoEstados } from '../modelo/admin/catalogo-estados';
 import { HttpClient, HttpResponse } from '@angular/common/http';
 import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs';
 import { environment } from 'src/environments/environment';

 @Injectable({
   providedIn: 'root'
 })
 export class CatalogoEstadosService {
   private host = environment.apiUrl;

   constructor(private http: HttpClient) { }

   public getCatalogo(): Observable<CatalogoEstados[]> {
     return this.http.get<CatalogoEstados[]>(`${this.host}/estados/listar`);
   }

   public crearCatalogo(catalogoEstados: CatalogoEstados): Observable<HttpResponse< CatalogoEstados>> {
     return this.http.post<CatalogoEstados>(`${this.host}/estados/crear`, catalogoEstados, { observe: 'response' });
   }
   public actualizarCatalogo(catalogoEstados: CatalogoEstados,  codigo :any): Observable<HttpResponse<CatalogoEstados>> {
     return this.http.put<CatalogoEstados>(`${this.host}/estados/${codigo}`, catalogoEstados, { observe: 'response' });
   }

   public eliminarCatalogo(codigo: any): Observable<string> {
     return this.http.delete<any>(`${this.host}/estados/${codigo}`);
     }
    public mostrarCatalogo(codigo: any): Observable<string> {
       return this.http.get<any>(`${this.host}/estados/${codigo}`);
       }
 }
