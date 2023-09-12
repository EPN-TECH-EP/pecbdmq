import { ComponenteNota } from '../modelo/admin/componente-nota';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CustomHttpResponse } from '../modelo/admin/custom-http-response';

@Injectable({
  providedIn: 'root'
})
export class ComponenteNotaService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}
  public getComponenteNota(): Observable<ComponenteNota[]> {
    return this.http.get<ComponenteNota[]>(`${this.host}/componenteNota/listar`);
  }

  public crearComponenteNota(componenteNota: ComponenteNota): Observable<HttpResponse<ComponenteNota>> {
    return this.http.post<ComponenteNota>(`${this.host}/componenteNota/crear`, componenteNota, { observe: 'response' });
  }

  public actualizarComponenteNota(componenteNota: ComponenteNota, componenteNotaId:any): Observable<HttpResponse<ComponenteNota>> {
    return this.http.put<ComponenteNota>(`${this.host}/componenteNota/${componenteNotaId}`, componenteNota, { observe: 'response' });
  }

  public eliminarComponenteNota(componenteNotaId: any): Observable<string> {
    return this.http.delete<string>(`${this.host}/componenteNota/${componenteNotaId}`);
    }
}
