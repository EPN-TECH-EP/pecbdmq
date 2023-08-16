import {Injectable} from '@angular/core';
import {IApiService} from './ApiServiceFactoryImpl';
import {Observable} from 'rxjs';
import {Semestre} from '../../../modelo/admin/semestre';
import {ProSemestreService} from '../../../servicios/profesionalizacion/pro-semestre.service';
import {EstudianteService} from '../../../servicios/formacion/estudiante.service';
import {Estudiante} from '../../../modelo/flujos/Estudiante';
import {ProEstudianteSemestreService} from '../../../servicios/profesionalizacion/pro-estudiante-semestre.service';
import {EstudianteSemestre} from '../../../modelo/admin/estudiante-semestre';
import {MateriaSemestre} from '../../../modelo/admin/materias-semestre';

@Injectable({
  providedIn: 'root'
})
export class EstudianteSemestreServiceCreator implements IApiService {
  idField = 'codigoEstudiante';
  idSelectListFieldId = 'codSemestre';
  idSelectListFieldName = 'semestre';
  selectLabel = 'Seleccionar Semestre:';

  constructor(
    private semestreService: ProSemestreService,
    private estudianteService: EstudianteService,
    private estudianteSemestreService: ProEstudianteSemestreService,
  ) {
  }

  getSelectItems(): Observable<Semestre[]> {
    return this.semestreService.getSemestre();
  }

  getListItems(): Observable<Estudiante[]> {
    return this.estudianteService.listar();
  }

  createAssignData(selectedItem: number, itemToAssign: EstudianteSemestre): void {
    this.estudianteSemestreService.crear({
      codigoSemestre: selectedItem,
      codigoEstudiante: itemToAssign.codEstudiante
    }).subscribe(resp => console.log(resp));
  }

  getAlreadyAddedData(selectedItemId: number): Observable<EstudianteSemestre[]> {
    return this.estudianteSemestreService.listarAsignados(selectedItemId);
  }

  getFieldLabel(item: Estudiante): string {
    if (item.codEstudiante)
      return `${item.codEstudiante} - ${item.codUnicoEstudiante}`;
    // @ts-ignore
    return `${item.codigoEstudiante} - ${item.codigoSemestre}`;
  }

  deleteAssignData(itemToAssign: MateriaSemestre): void {
    this.estudianteSemestreService.eliminar(itemToAssign.codigo).subscribe(resp => console.log(resp));
  }
}
