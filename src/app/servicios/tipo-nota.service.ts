import { TipoNota } from './../modelo/tipo_nota';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CustomHttpResponse } from '../modelo/custom-http-response';
@Injectable({
  providedIn: 'root'
})
export class TipoNotaService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getTipoNota(): Observable<TipoNota[]> {
    return this.http.get<TipoNota[]>(`${this.host}/gen_tipo_nota/listar`);
  }

  public crearTipoNota(tiponota: TipoNota): Observable<HttpResponse<TipoNota>> {
    return this.http.post<TipoNota>(`${this.host}/gen_tipo_nota/crear`, tiponota, { observe: 'response' });
  }

  public actualizarTipoNota(tiponota: TipoNota, tiponotaId:any): Observable<HttpResponse<TipoNota>> {
    return this.http.put<TipoNota>(`${this.host}/gen_tipo_nota/${tiponotaId}`, tiponota, { observe: 'response' });
  }

  public eliminarTipoNota(tiponotaId: any): Observable<string> {
    return this.http.delete<string>(`${this.host}/gen_tipo_nota/${tiponotaId}`);
    }
}
