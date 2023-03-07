import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { TipoDocumento } from '../modelo/tipo_documento';
import { CustomHttpResponse } from '../modelo/custom-http-response';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}
  public getTipoDocumento(): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(`${this.host}/tipodocumento/listar`);
  }

  public crearTipoDocumento(tipodocumento: TipoDocumento): Observable<HttpResponse<TipoDocumento>> {
    return this.http.post<TipoDocumento>(`${this.host}/tipodocumento/crear`, tipodocumento, { observe: 'response' });
  }

  public actualizarTipoDocumento(tipodocumento: TipoDocumento, tipodocumentoId:any): Observable<HttpResponse<TipoDocumento>> {
    return this.http.put<TipoDocumento>(`${this.host}/tipodocumento/${tipodocumentoId}`, tipodocumento, { observe: 'response' });
  }

  public eliminarTipoDocumento(tipodocumentoId: any): Observable<string> {
    return this.http.delete<string>(`${this.host}/tipodocumento/${tipodocumentoId}`);
    }
}
