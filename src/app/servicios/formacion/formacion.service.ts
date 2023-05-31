import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {CustomHttpResponse} from '../../modelo/admin/custom-http-response';
import {ModuloEstado} from "../../modelo/admin/modulo-estado";

@Injectable({
  providedIn: 'root',
})
export class FormacionService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // servicio de consulta de estado de período académico de formación
  // GET periodoacademico/validaestado

  /* RESPUESTA
  {
    "timeStamp": "18-05-2023 09:06:47",
    "httpStatusCode": 200,
    "httpStatus": "OK",
    "razon": "OK",
    "mensaje": "CONVOCATORIA"
}   */

  public getEstadoFormacion(): Observable<HttpResponse<CustomHttpResponse>> {
    return this.http.get<CustomHttpResponse>(
      `${this.host}/periodoacademico/validaestado`,
      { observe: 'response' }
    );
  }
  
    getEstadosFormacion(): Observable<ModuloEstado[]> {
    return this.http.get<ModuloEstado[]>(`${this.host}/moduloestados/bymodulo?modulo=1`);
  }

  getEstadoActual(): Observable<CustomHttpResponse> {
    return this.http.get<CustomHttpResponse>(`${this.host}/periodoacademico/validaestado`);
  }
  
  actualizarEstadoActual(formData: FormData): Observable<CustomHttpResponse> {
    return this.http.post<CustomHttpResponse>(`${this.host}/periodoacademico/actualizaEstado`, formData);
  }
}
