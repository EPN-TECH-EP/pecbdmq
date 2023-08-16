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
import {
  ProMateriaParaleloCreateUpdateDto,
  ProMateriaParaleloDto
} from "../../modelo/flujos/profesionalizacion/pro-paralelo-materia.models";

@Injectable({
  providedIn: 'root'
})
export class ProMateriaParaleloService extends ProfesionalizacionService<ProMateriaParaleloDto, ProMateriaParaleloCreateUpdateDto> {

  constructor(http: HttpClient) {
    super(http);
    this.path = '/proSemestreMateriaParalelo';
  }

  public getAllByCodSemestreMateria(id: number): Observable<ProMateriaParaleloDto[]> {
    return this.http.get<ProMateriaParaleloDto[]>(`${this.host}${this.path}/${id}/listar`);
  }

}
