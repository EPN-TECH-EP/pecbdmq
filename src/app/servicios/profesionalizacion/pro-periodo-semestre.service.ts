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
import {
  ProPeriodoSemestreCreateUpdateDto,
  ProPeriodoSemestreDto
} from "../../modelo/flujos/profesionalizacion/pro-periodo-semestre.models";

@Injectable({
  providedIn: 'root',
})
export class ProPeriodoSemestreService extends ProfesionalizacionService<ProPeriodoSemestreDto, ProPeriodoSemestreCreateUpdateDto> {


  constructor(http: HttpClient) {
    super(http);
    this.path = '/proPeriodoSemestre';
  }

  getAllByPeriodo(id: number) {
    return this.http.get<ProPeriodoSemestreDto[]>(`${this.host}${this.path}/${id}/listar`);
  }

}
