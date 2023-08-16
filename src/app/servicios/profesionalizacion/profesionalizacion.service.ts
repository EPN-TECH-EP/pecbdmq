import {environment} from "../../../environments/environment";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {CustomHttpResponse} from "../../modelo/admin/custom-http-response";
import {Injectable} from "@angular/core";
import {ProPeriodo} from "../../modelo/admin/profesionalizacion/pro-periodo";
import {UnidadGestion} from "../../modelo/admin/unidad-gestion";

@Injectable({
  providedIn: 'root',
})
export class ProfesionalizacionService<T, U> {

  protected host = environment.apiUrl;
  protected path = '';

  constructor(protected http: HttpClient) {
  }

  public listar(): Observable<T[]> {
    return this.http.get<T[]>(`${this.host}${this.path}/listar`);
  }


  public crear(formData: U): Observable<HttpResponse<U>> {
    return this.http.post<U>(`${this.host}${this.path}/crear`, formData, {observe: 'response'});
  }

  public eliminar(codigo: number): Observable<string> {
    return this.http.delete<string>(`${this.host}${this.path}/${codigo}`);
  }

  public actualizar(formData: U, codigo: any): Observable<HttpResponse<U>> {
    return this.http.put<U>(`${this.host}${this.path}/${codigo}`, formData, {observe: 'response'});
  }

}
