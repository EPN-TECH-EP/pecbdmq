import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { UnidadGestion } from '../modelo/unidad_gestion';
import { CustomHttpResponse } from '../modelo/custom-http-response';
@Injectable({
  providedIn: 'root'
})
export class UnidadGestionService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getUnidadGestion(): Observable<UnidadGestion[]> {
    return this.http.get<UnidadGestion[]>(`${this.host}/unidadgestion/listar`);
  }

  public crearUnidad(unidad: UnidadGestion): Observable<HttpResponse<UnidadGestion>> {
    return this.http.post<UnidadGestion>(`${this.host}/unidadgestion/crear`, unidad, { observe: 'response' });
  }

  public actualizarUnidad(unidad: UnidadGestion, unidadId:any): Observable<HttpResponse<UnidadGestion>> {
    return this.http.put<UnidadGestion>(`${this.host}/unidadgestion/${unidadId}`, unidad, { observe: 'response' });
  }

  public eliminarUnidad(unidadId: any): Observable<string> {
    return this.http.delete<string>(`${this.host}/unidadgestion/${unidadId}`);
    }
}

