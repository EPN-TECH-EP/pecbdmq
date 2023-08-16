import {Injectable} from '@angular/core';
import {HttpClient,} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {CustomHttpResponse} from '../../modelo/admin/custom-http-response';
import {ProfesionalizacionService} from "./profesionalizacion.service";
import {
  ProPeriodoConvocatoriaCreateUpdateDto,
  ProPeriodoConvocatoriaDto
} from "../../modelo/flujos/profesionalizacion/ProPeriodoConvocatoriaDto";

@Injectable({
  providedIn: 'root',
})
export class ProPeriodoConvocatoriaService extends ProfesionalizacionService<ProPeriodoConvocatoriaDto, ProPeriodoConvocatoriaCreateUpdateDto> {


  constructor(http: HttpClient) {
    super(http);
    this.path = '/proConvocatoria';
  }

  getCodigoUnicoCreacion() {
    return this.http.get<string>(`${this.host}${this.path}/codigoUnicoCreacion`, {responseType: 'text' as 'json'});
  }

  getConvocatoriaActiva() {
    return this.http.get(`${this.host}${this.path}/activa`);
  }
}
