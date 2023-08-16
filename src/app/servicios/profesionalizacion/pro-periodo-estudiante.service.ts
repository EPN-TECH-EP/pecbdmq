import {ProfesionalizacionService} from "../profesionalizacion/profesionalizacion.service";
import {
  ProPeriodoEstudianteCreateUpdateDto,
  ProPeriodoEstudianteDto
} from "../../modelo/flujos/profesionalizacion/pro-periodo-estudiante.models";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ProfesionalizacionBuscarService} from "./profesionalizacion-buscar.service";
@Injectable({
  providedIn: 'root',
})
export class ProPeriodoEstudianteService extends ProfesionalizacionBuscarService<ProPeriodoEstudianteDto, ProPeriodoEstudianteCreateUpdateDto>{
  constructor(http: HttpClient) {
    super(http);
    this.path = '/proPeriodoEstudiante';
  }
  getAllByPeriodo(id:number){
    return this.http.get<ProPeriodoEstudianteDto[]>(`${this.host}${this.path}/${id}/listar`)
  }
}
