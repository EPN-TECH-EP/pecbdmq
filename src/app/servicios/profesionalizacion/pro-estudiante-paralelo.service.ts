import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProfesionalizacionService} from './profesionalizacion.service';
import {
  ProEstudianteParaleloCreateUpdateDto,
  ProEstudianteParaleloDto, ProEstudianteParaleloWithNotasDto
} from '../../modelo/flujos/profesionalizacion/pro-estudiante-paralelo.models';

@Injectable({
    providedIn: 'root'
})
export class ProEstudianteParaleloService extends
  ProfesionalizacionService<ProEstudianteParaleloDto, ProEstudianteParaleloCreateUpdateDto> {

    constructor(http: HttpClient) {
        super(http);
        this.path = '/proSemestreMateriaParaleloEstudiante';
    }

    public getAllByCodSemestreMateriaParalelo(idCodMateriaParalelo: number): Observable<ProEstudianteParaleloWithNotasDto[]> {
        return this.http.get<ProEstudianteParaleloWithNotasDto[]>(`${this.host}${this.path}/${idCodMateriaParalelo}/listar`);
    }

}
