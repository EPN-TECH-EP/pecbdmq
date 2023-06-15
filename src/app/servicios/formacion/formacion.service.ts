import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomHttpResponse } from '../../modelo/admin/custom-http-response';
import { ModuloEstado } from "../../modelo/admin/modulo-estado";
import { Usuario } from "../../modelo/admin/usuario";
import { tap } from "rxjs/operators";

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

  // private estadoActual = new BehaviorSubject<string | null>(null);
  // estadoActual$ = this.estadoActual.asObservable();

  getEstadosFormacion(): Observable<ModuloEstado[]> {
    return this.http.get<ModuloEstado[]>(`${ this.host }/moduloestados/bymodulo?modulo=1`);
  }

  getEstadoActual(): Observable<CustomHttpResponse> {
    return this.http.get<CustomHttpResponse>(`${ this.host }/periodoacademico/validaestado`)
    //   // .pipe(
    //   // tap((response: CustomHttpResponse) => {
    //   //   this.estadoActual.next(response.mensaje);
    //   // })
    // );
  }

  actualizarEstadoActual(formData: FormData): Observable<CustomHttpResponse> {
    return this.http.post<CustomHttpResponse>(`${ this.host }/periodoacademico/actualizaEstado`, formData);
  }
}
