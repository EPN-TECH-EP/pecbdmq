import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { UnidadGestion } from '../modelo/admin/unidad-gestion';

@Injectable({
  providedIn: 'root'
})
export class UnidadGestionService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(): Observable<UnidadGestion[]> {
    return this.http.get<UnidadGestion[]>(`${ this.host }/unidadgestion/listar`);
  }

  crear(unidad: UnidadGestion): Observable<HttpResponse<UnidadGestion>> {
    return this.http.post<UnidadGestion>(`${ this.host }/unidadgestion/crear`, unidad, { observe: 'response' });
  }

  actualizar(unidad: UnidadGestion, unidadId: any): Observable<HttpResponse<UnidadGestion>> {
    return this.http.put<UnidadGestion>(`${ this.host }/unidadgestion/${ unidadId }`, unidad, { observe: 'response' });
  }

  eliminar(unidadId: any): Observable<string> {
    return this.http.delete<string>(`${ this.host }/unidadgestion/${ unidadId }`);
  }
}

