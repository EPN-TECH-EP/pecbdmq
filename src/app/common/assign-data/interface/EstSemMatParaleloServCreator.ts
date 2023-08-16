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
import {Paralelo} from '../../../modelo/admin/paralelo';
import {ProEstSemMatParaleloService} from '../../../servicios/profesionalizacion/pro-est-sem-mat-paralelo.service';
import {ProParaleloService} from '../../../servicios/profesionalizacion/pro-paralelo.service';
@Injectable({
  providedIn: 'root'
})
export class EstSemMatParaleloServCreator implements IApiService {
  idField = 'codMateria';
  idSelectListFieldId = 'codParalelo';
  idSelectListFieldName = 'nombreParalelo';
  selectLabel = 'Seleccionar Paralelo:'

  constructor(
    private materiaService: ProMateriaService,
    private paraleloService: ProParaleloService,
    private estudianteSemestreService: ProEstudianteSemestreService,
    private estudianteSemestreMateriaService: ProEstudianteSemestreMateriaService,
    private estSemMatParaleloService: ProEstSemMatParaleloService,
  ) {}

  getSelectItems(): Observable<EstudianteSemestre[]> {
    return this.paraleloService.getParalelos();
  }

  getListItems(): Observable<EstudianteSemestreMateria[]> {
    throw new Error('This method should not be handled');
  }

  createAssignData(itemList: number, selectedItem: EstudianteSemestreMateria): void {
    this.estSemMatParaleloService.crear({
      codEstudianteSemestreMateria: selectedItem.codEstudianteSemestreMateria,
      codParalelo: itemList,
      estado: 'ACTIVO'
    }).subscribe(resp => console.log(resp));
  }

  deleteAssignData(itemToAssign: MateriaSemestre): void {
    this.estudianteSemestreMateriaService.eliminar(itemToAssign.codigo).subscribe(resp => console.log(resp))
  }

  getAlreadyAddedData(selectedItemId: number): Observable<EstudianteSemestreMateria[]> {
    return this.estudianteSemestreMateriaService.listar();
  }

  getFieldLabel(item: EstudianteSemestreMateria): string {
    return `${item.codEstudianteSemestre} - ${item.estudiante?.estado}`; // TODO refill from back
  }

}
