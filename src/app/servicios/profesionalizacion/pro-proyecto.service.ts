import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Proyecto} from '../../modelo/admin/profesionalizacion/pro-proyecto';

@Injectable({
  providedIn: 'root',
})
export class ProProyectoService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  listar(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.host}/proCatalogoProyecto/listar`);
  }

  crear(proyecto: Proyecto): Observable<HttpResponse<Proyecto>> {
    return this.http.post<Proyecto>(`${this.host}/proCatalogoProyecto/crear`, proyecto, {observe: 'response'});
  }

  eliminar(codProyecto: number): Observable<string> {
    return this.http.delete<string>(`${this.host}/proCatalogoProyecto/${codProyecto}`);
  }

  actualizar(proyecto: Proyecto, codProyecto: any): Observable<HttpResponse<Proyecto>> {
    return this.http.put<Proyecto>(`${this.host}/proCatalogoProyecto/${codProyecto}`, proyecto, {observe: 'response'});
  }

}
