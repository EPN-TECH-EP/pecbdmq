import {Injectable} from "@angular/core";
import {ProfesionalizacionService} from "./profesionalizacion.service";
import {Instructor, InstructorRequest} from "../../modelo/flujos/instructor";
import {HttpClient} from "@angular/common/http";
import {ProDelegadoCreateUpdateDto, ProDelegadoDto} from "../../modelo/flujos/profesionalizacion/pro-delegado-dto";


@Injectable({
  providedIn: 'root'
})
export class ProDelegadoService extends ProfesionalizacionService<ProDelegadoDto, ProDelegadoCreateUpdateDto> {

  constructor(http: HttpClient) {
    super(http);
    this.path = '/proDelegados';
  }

  getlistarAsignados() {
    return this.http.get<ProDelegadoDto[]>(`${this.host}${this.path}/listarAsignado`, {});
  }
}
