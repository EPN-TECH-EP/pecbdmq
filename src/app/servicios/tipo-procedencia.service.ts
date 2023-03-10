import { TipoProcedencia } from '../modelo/tipo-procedencia';
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
export class TipoProcedenciaService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getTipoProcedencia(): Observable<TipoProcedencia[]> {
    return this.http.get<TipoProcedencia[]>(`${this.host}/tipoprocedencia/listar`);
  }

  public crearTipoProcedencia(TipoProcedencia: TipoProcedencia): Observable<HttpResponse<TipoProcedencia>> {
    return this.http.post<TipoProcedencia>(`${this.host}/tipoprocedencia/crear`, TipoProcedencia, { observe: 'response' });
  }

  public actualizarTipoProcedencia(TipoProcedencia: TipoProcedencia, TipoProcedenciaId:any): Observable<HttpResponse<TipoProcedencia>> {
    return this.http.put<TipoProcedencia>(`${this.host}/tipoprocedencia/${TipoProcedenciaId}`, TipoProcedencia, { observe: 'response' });
  }

  public eliminarTipoProcedencia(TipoProcedenciaId: any): Observable<string> {
    return this.http.delete<string>(`${this.host}/tipoprocedencia/${TipoProcedenciaId}`);
    }
}
