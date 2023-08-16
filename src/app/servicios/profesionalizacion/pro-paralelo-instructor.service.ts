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
import {
    ProEstudianteParaleloCreateUpdateDto,
    ProEstudianteParaleloDto
} from "../../modelo/flujos/profesionalizacion/pro-estudiante-paralelo.models";
import {
    ProParaleloInsructorCreateUpdateDto,
    ProParaleloInsructorDto
} from "../../modelo/flujos/profesionalizacion/pro-paralelo-instructor.modelo";

@Injectable({
    providedIn: 'root'
})
export class ProParaleloInstructorService extends ProfesionalizacionService<ProParaleloInsructorDto, ProParaleloInsructorCreateUpdateDto> {

    constructor(http: HttpClient) {
        super(http);
        this.path = '/proSemestreMateriaParaleloInstructor';
    }

    public getAllByCodMateriaParalelo(id: number): Observable<ProParaleloInsructorDto[]> {
        return this.http.get<ProParaleloInsructorDto[]>(`${this.host}${this.path}/${id}/listar`);
    }

}
