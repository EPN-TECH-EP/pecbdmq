import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ModuloEstado } from '../modelo/admin/modulo-estado';

@Injectable({
  providedIn: 'root'
})
export class ModuloEstadosService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<ModuloEstado[]> {
    return this.http.get<ModuloEstado[]>(`${ this.host }/moduloestados/listartodo`);
  }

  crear(moduloEstados: ModuloEstado): Observable<HttpResponse<ModuloEstado>> {
    return this.http.post<ModuloEstado>(`${ this.host }/moduloestados/crear`, moduloEstados, { observe: 'response' });
  }

  actualizar(moduloEstados: ModuloEstado, codigo: any): Observable<HttpResponse<ModuloEstado>> {
    return this.http.put<ModuloEstado>(`${ this.host }/moduloestados/${ codigo }`, moduloEstados, { observe: 'response' });
  }

  eliminar(codigo: any): Observable<string> {
    return this.http.delete<any>(`${ this.host }/moduloestados/${ codigo }`);
  }

}
