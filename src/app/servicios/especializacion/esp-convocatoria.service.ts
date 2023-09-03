import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Convocatoria} from "../../modelo/admin/convocatoria";

export interface ConvocatoriaEspecializacion {
  nombreConvocatoria: string;
  fechaInicioConvocatoria: Date;
  fechaFinConvocatoria: Date;
  codCursoEspecializacion: number;
  correo: string;
  fechaActual: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EspConvocatoriaService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  crear(convocatoria: ConvocatoriaEspecializacion) {
    return this.http.post<Convocatoria>(`${this.host}/convocatoriaCurso/crear`, convocatoria);
  }

  actualizar(convocatoria: ConvocatoriaEspecializacion, codConvocatoria: number) {
    return this.http.put<Convocatoria>(`${this.host}/convocatoriaCurso/${codConvocatoria}`, convocatoria);
  }

  enviarNotificacion(codConvocatoria: number) {
    const formData = new FormData();
    formData.append('codConvocatoria', `${codConvocatoria}`);
    return this.http.post(`${this.host}/convocatoriaCurso/notificar`, formData);
  }

  obtenerByCurso(codCurso: number) {
    return this.http.get<Convocatoria>(`${this.host}/convocatoriaCurso/byCurso/${codCurso}`);
  }

}
