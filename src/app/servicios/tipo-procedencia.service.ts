import { TipoProcedencia } from '../modelo/admin/tipo-procedencia';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoProcedenciaService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(): Observable<TipoProcedencia[]> {
    return this.http.get<TipoProcedencia[]>(`${ this.host }/tipoprocedencia/listar`);
  }

  crear(TipoProcedencia: TipoProcedencia): Observable<HttpResponse<TipoProcedencia>> {
    return this.http.post<TipoProcedencia>(`${ this.host }/tipoprocedencia/crear`, TipoProcedencia, { observe: 'response' });
  }

  actualizar(TipoProcedencia: TipoProcedencia, TipoProcedenciaId: any): Observable<HttpResponse<TipoProcedencia>> {
    return this.http.put<TipoProcedencia>(`${ this.host }/tipoprocedencia/${ TipoProcedenciaId }`, TipoProcedencia, { observe: 'response' });
  }

  eliminar(TipoProcedenciaId: any): Observable<string> {
    return this.http.delete<string>(`${ this.host }/tipoprocedencia/${ TipoProcedenciaId }`);
    }
}
