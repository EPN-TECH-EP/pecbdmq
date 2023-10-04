import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse,} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Parametro} from '../modelo/admin/parametro';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametroService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public get(): Observable<Parametro[]> {
    return this.http.get<Parametro[]>(`${this.host}/parametro/listar`);
  }

  public crear(semestre: Parametro): Observable<HttpResponse<Parametro>> {
    return this.http.post<Parametro>(`${this.host}/parametro/crear`, semestre, {observe: 'response'});
  }

  public eliminar(codSemestre: any): Observable<string> {
    return this.http.delete<any>(`${this.host}/parametro/${codSemestre}`);
  }

  public actualizar(semestre: Parametro): Observable<HttpResponse<Parametro>> {
    return this.http.put<Parametro>(`${this.host}/parametro/${semestre.codParametro}`, semestre, {observe: 'response'});
  }

}
