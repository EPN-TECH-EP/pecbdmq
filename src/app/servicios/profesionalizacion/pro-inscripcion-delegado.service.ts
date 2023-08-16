import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ProInscripcionDelegado} from '../../modelo/admin/profesionalizacion/pro-inscripcion-delegado';
import {
  ProInscripcionDelegadoDto
} from "../../modelo/flujos/profesionalizacion/pro-inscripcion-delegado.dto";

@Injectable({
  providedIn: 'root',
})
export class ProInscripcionDelegadoService {xS
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  listar(): Observable<ProInscripcionDelegado[]> {
    return this.http.get<ProInscripcionDelegado[]>(`${this.host}/proInscripcionesDelegados/listar`);
  }

  listByConvocatoria(idConvocatoria: number) {
    return this.http.get<ProInscripcionDelegado[]>(`${this.host}/proInscripcionesDelegados/listar`);
  }

  listByDatosConvocatoria(idConvocatoria: number, codDatosPersonales:number){
    return this.http.get<ProInscripcionDelegadoDto[]>(`${this.host}/proInscripcionesDelegados/datos/${idConvocatoria}/listar/${codDatosPersonales}`);
  }
  crear(materia: ProInscripcionDelegado): Observable<HttpResponse<ProInscripcionDelegado>> {
    return this.http.post<ProInscripcionDelegado>(`${this.host}/proInscripcionesDelegados/crear`, materia, {observe: 'response'});
  }

  eliminar(codInscripcionesDelegados: number): Observable<string> {
    return this.http.delete<string>(`${this.host}/proInscripcionesDelegados/${codInscripcionesDelegados}`);
  }

  actualizar(proInscripcionDelegado: ProInscripcionDelegado): Observable<HttpResponse<ProInscripcionDelegado>> {
    return this.http.put<ProInscripcionDelegado>(`${this.host}/proInscripcionesDelegados/${proInscripcionDelegado.codInscripcionesDelegados}`,
      proInscripcionDelegado, {observe: 'response'});
  }
}

