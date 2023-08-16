import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProfesionalizacionService} from './profesionalizacion.service';
import {ProNotaDtoModels} from '../../modelo/flujos/profesionalizacion/pro-nota-dto.models';
import {ProMateriaSemestreDto} from "../../modelo/flujos/profesionalizacion/pro-materia-semestre.models";
import {
  ProNotaProfesionalizacionDto
} from "../../modelo/flujos/profesionalizacion/pro-nota-profesionalizacion-general.models";

@Injectable({
  providedIn: 'root',
})
export class ProNotaService extends
  ProfesionalizacionService<ProNotaDtoModels, ProNotaDtoModels> {

  constructor(http: HttpClient) {
    super(http);
    this.path = '/proNotaProfesionalizacion';
  }

  eliminar(codProNota: number): Observable<string> {
    return this.http.get<string>(`${this.host}${this.path}/${codProNota}`);
  }

  listByCodEstudianteParaleloWithNotas(codEstudianteSemestreMateriaParalelo: number): Observable<ProNotaDtoModels[]> {
    return this.http.get<ProNotaDtoModels[]>(`${this.host}${this.path}/datos/${codEstudianteSemestreMateriaParalelo}/listar`);
  }

  getByAll(id1: number, id2: number): Observable<ProNotaProfesionalizacionDto[]> {
    return this.http.get<ProNotaProfesionalizacionDto[]>(`${this.host}${this.path}/filtrar/${id1}/${id2}`);
  }

}

