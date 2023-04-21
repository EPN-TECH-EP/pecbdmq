import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ModuloEstados } from '../modelo/admin/modulo-estados';

@Injectable({
  providedIn: 'root'
})
export class ModuloEstadosService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getModuloEstados(): Observable<ModuloEstados[]> {
    return this.http.get<ModuloEstados[]>(`${this.host}/moduloestados/listartodo`);
  }

  public registroModuloEstados(moduloEstados: ModuloEstados): Observable<HttpResponse< ModuloEstados>> {
    return this.http.post<ModuloEstados>(`${this.host}/moduloestados/crear`, moduloEstados, { observe: 'response' });
  }
  public actualizarModuloEstados(moduloEstados: ModuloEstados,  codigo :any): Observable<HttpResponse<ModuloEstados>> {
    return this.http.put<ModuloEstados>(`${this.host}/moduloestados/${codigo}`, moduloEstados, { observe: 'response' });
  }
  public eliminarModuloEstados(codigo: any): Observable<string> {
    return this.http.delete<any>(`${this.host}/moduloestados/${codigo}`);
    }

    public mostrarModuloEstados(codigo: any): Observable<string> {
    return this.http.get<any>(`${this.host}/moduloestados/${codigo}`);
    }

}
