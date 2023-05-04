import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Modulo } from '../modelo/admin/modulo';
import { CustomHttpResponse } from '../modelo/admin/custom-http-response';
@Injectable({
  providedIn: 'root'
})
export class ModuloService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getModulo(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(`${this.host}/modulo/listar`);
  }

  public crearModulo(modulo: Modulo): Observable<HttpResponse<Modulo>> {
    return this.http.post<Modulo>(`${this.host}/modulo/crear`, modulo, { observe: 'response' });
  }

  public actualizarModulo(modulo: Modulo, moduloId:any): Observable<HttpResponse<Modulo>> {
    return this.http.put<Modulo>(`${this.host}/modulo/${moduloId}`, modulo, { observe: 'response' });
  }

  public eliminarModulo(moduloId: any): Observable<string> {
    return this.http.delete<string>(`${this.host}/modulo/${moduloId}`);
    }

    public mostrar1Modulo(codModulo: any): Observable<string> {
      return this.http.get<any>(`${this.host}/modulo/${codModulo}`);
      }
}
