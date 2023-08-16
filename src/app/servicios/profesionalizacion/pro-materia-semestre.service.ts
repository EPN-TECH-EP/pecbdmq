import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse,} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {MateriaSemestre} from '../../modelo/admin/materias-semestre';
import {Semestre} from "../../modelo/admin/semestre";
import {ProPeriodoSemestreDto} from "../../modelo/flujos/profesionalizacion/pro-periodo-semestre.models";
import {
  ProMateriaSemestreCreateUpdateDto,
  ProMateriaSemestreDto
} from "../../modelo/flujos/profesionalizacion/pro-materia-semestre.models";
import {ProfesionalizacionService} from "./profesionalizacion.service";

@Injectable({
  providedIn: 'root'
})
export class ProMateriaSemestreService extends ProfesionalizacionService<ProMateriaSemestreDto, ProMateriaSemestreCreateUpdateDto> {

  constructor(http: HttpClient) {
    super(http);
    this.path = '/proMateriaSemestre';
  }

  public getAllByPeriodoSemestre(id: number): Observable<ProMateriaSemestreDto[]> {
    return this.http.get<ProMateriaSemestreDto[]>(`${this.host}${this.path}/${id}/listar`);
  }

}
