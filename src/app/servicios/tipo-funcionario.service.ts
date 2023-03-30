import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { TipoFuncionario } from '../modelo/tipo-funcionario';
import { CustomHttpResponse } from '../modelo/custom-http-response';
 import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TipoFuncionarioService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getTipoFuncionario(): Observable<TipoFuncionario[]> {
    return this.http.get<TipoFuncionario[]>(`${this.host}/tipofuncionario/listar`)
    .pipe(map((response: any) => response.json()));

  }

  public crearTipoFuncionario(tipofuncionario: TipoFuncionario): Observable<HttpResponse<TipoFuncionario>> {
    return this.http.post<TipoFuncionario>(`${this.host}/tipofuncionario/crear`, tipofuncionario, { observe: 'response' });
  }

  public actualizarTipoFuncionario(tipofuncionario: TipoFuncionario, tipofuncionarioId:any): Observable<HttpResponse<TipoFuncionario>> {
    return this.http.put<TipoFuncionario>(`${this.host}/tipofuncionario/${tipofuncionarioId}`, tipofuncionario, { observe: 'response' });
  }

  public eliminarTipoFuncionario(tipofuncionarioId: any): Observable<string> {
    return this.http.delete<string>(`${this.host}/tipofuncionario/${tipofuncionarioId}`);
    }
}

