import {Injectable} from '@angular/core';
import {IApiService} from './ApiServiceFactoryImpl';
import {Observable} from 'rxjs';
import {ProMateriaService} from '../../../servicios/profesionalizacion/pro-materia.service';
import {Materia} from '../../../modelo/admin/materias';
import {MateriaSemestre} from '../../../modelo/admin/materias-semestre';
import {ProEstudianteSemestreService} from '../../../servicios/profesionalizacion/pro-estudiante-semestre.service';
import {EstudianteSemestre} from '../../../modelo/admin/estudiante-semestre';
import {
  ProEstudianteSemestreMateriaService
} from '../../../servicios/profesionalizacion/pro-estudiante-semestre-materia.service';
import {EstudianteSemestreMateria} from '../../../modelo/admin/profesionalizacion/estudiante-semestre-materia';
@Injectable({
  providedIn: 'root'
})
export class EstudianteSemestreMateriaServCreator implements IApiService {
  idField = 'codMateria';
  idSelectListFieldId = 'codigo';
  idSelectListFieldName = 'nombreEstudiante'; // TODO definir el campo q debe retornar del back
  selectLabel = 'Seleccionar Estudiante:'

  constructor(
    private materiaService: ProMateriaService,
    private estudianteSemestreService: ProEstudianteSemestreService,
    private estudianteSemestreMateriaService: ProEstudianteSemestreMateriaService,
  ) {}

  getSelectItems(): Observable<EstudianteSemestre[]> {
    return this.estudianteSemestreService.listar();
  }

  getListItems(): Observable<Materia[]> {
    return this.materiaService.listar();
  }

  createAssignData(selectedItem: number, itemList: Materia): void {
    this.estudianteSemestreMateriaService.crear({
      codMateria: itemList.codMateria,
      codEstudianteSemestre: selectedItem,
    }).subscribe(resp => console.log(resp));
  }

  deleteAssignData(itemToAssign: MateriaSemestre): void {
    this.estudianteSemestreMateriaService.eliminar(itemToAssign.codigo).subscribe(resp => console.log(resp))
  }

  getAlreadyAddedData(selectedItemId: number): Observable<EstudianteSemestreMateria[]> {
    return this.estudianteSemestreMateriaService.listar();
  }

  getFieldLabel(item: Materia): string {
    return item.nombre;
  }

}
