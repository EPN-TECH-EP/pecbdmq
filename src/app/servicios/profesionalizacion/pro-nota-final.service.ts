import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {ProfesionalizacionService} from './profesionalizacion.service';
import {ProNotaDtoModels} from '../../modelo/flujos/profesionalizacion/pro-nota-dto.models';
import {ProNotaFinalModels} from '../../modelo/flujos/profesionalizacion/pro-nota-final.models';

@Injectable({
  providedIn: 'root',
})
export class ProNotaFinalService extends
  ProfesionalizacionService<ProNotaFinalModels, ProNotaFinalModels> {

  constructor(http: HttpClient) {
    super(http);
    this.path = '/proNotaProfesionalizacionFinal';
  }

  listNotasByCodPeriodoSemestre(codPeriodoSemestre: number) {
    return of([
      {
        'codEstudiante': 31,
        'nombre': 'CESAR FERNANDO',
        'apellido': 'HERRERA RIVADENEIRA',
        'correoPersonal': 'gokuniidea@gmail.com',
        'codDatosPersonales': 430,
        'estado': 'string',
        'codNotaProfesionalizacionFinal': 0,
        'codEstudianteSemestre': 0,
        'notaParcial1': 18,
        'notaParcial2': 14,
        'notaPractica': 13,
        'notaAsistencia': 19,
        'codSemestre': 0,
        'promedioDisciplinaInstructor': 0,
        'promedioDisciplinaOficialSemana': 0,
        'promedioAcademico': 0,
        'promedioDisciplinaFinal': 0,
        'ponderacionAcademica': 0,
        'ponderacionDisciplina': 0,
        'notaFinalAcademica': 0,
        'notaFinalDisciplina': 0,
        'notaFinal': 19,
        'realizoEncuesta': true,
        'aprobado': true
      },
      {
        'codEstudiante': 23,
        'nombre': 'Ludwing Jair',
        'apellido': 'Gomez Tipantiza',
        'correoPersonal': 'ludwing.gomez@epn.edu.ec',
        'codDatosPersonales': 63,
        'estado': 'string',
        'codNotaProfesionalizacionFinal': null,
        'codEstudianteSemestre': null,
        'notaParcial1': null,
        'notaParcial2': null,
        'notaPractica': null,
        'notaAsistencia': null,
        'codSemestre': null,
        'promedioDisciplinaInstructor': null,
        'promedioDisciplinaOficialSemana': null,
        'promedioAcademico': null,
        'promedioDisciplinaFinal': null,
        'ponderacionAcademica': null,
        'ponderacionDisciplina': null,
        'notaFinalAcademica': null,
        'notaFinalDisciplina': null,
        'notaFinal': null,
        'realizoEncuesta': true,
        'aprobado': true
      }
    ])
    // return this.http.get<ProNotaDtoModels[]>(`${this.host}${this.path}/datos/${codPeriodoSemestre}/listar`);
  }

}

