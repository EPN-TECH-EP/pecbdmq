import {ProfesionalizacionService} from "./profesionalizacion.service";
import {
  ProSemestreEstudianteCreateUpdateDto,
  ProSemestreEstudianteDto
} from "../../modelo/flujos/profesionalizacion/pro-semestre-estudiante.models";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class ProSemestreEstudianteService extends ProfesionalizacionService<ProSemestreEstudianteDto, ProSemestreEstudianteCreateUpdateDto>{
  constructor(http: HttpClient) {
    super(http);
    this.path='/proSemestreEstudiante';
  }
  getAllBySemestre(id:number){
    return this.http.get<ProSemestreEstudianteDto[]>(`${this.host}${this.path}/${id}/listar`);
  }

}
