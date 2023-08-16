import {Injectable} from "@angular/core";
import {ProfesionalizacionService} from "./profesionalizacion.service";
import {
  ProPeriodoConvocatoriaCreateUpdateDto,
  ProPeriodoConvocatoriaDto
} from "../../modelo/flujos/profesionalizacion/ProPeriodoConvocatoriaDto";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProMateriaParaleloDto} from "../../modelo/flujos/profesionalizacion/pro-paralelo-materia.models";
import {
  ProParaleloEstudianteCreateUpdateDto,
  ProParaleloEstudianteDto
} from "../../modelo/flujos/profesionalizacion/pro-paralelo-estudiante.models";

@Injectable({
  providedIn: 'root',
})
export class ProParaleloEstudianteService extends ProfesionalizacionService<ProParaleloEstudianteDto, ProParaleloEstudianteCreateUpdateDto> {


  constructor(http: HttpClient) {
    super(http);
    this.path = '/proSemestreMateriaParaleloEstudiante';
  }

  getAllByCodMateriaParalelo(id: number): Observable<ProParaleloEstudianteDto[]> {
    return this.http.get<ProParaleloEstudianteDto[]>(`${this.host}${this.path}/${id}/listar`);
  }

  getConvocatoriaActiva() {
    return this.http.get(`${this.host}${this.path}/activa`);
  }
}
