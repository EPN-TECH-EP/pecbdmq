import {Injectable} from '@angular/core';
import {ApiServiceFactory} from './ApiServiceFactory';
import {Observable} from 'rxjs';
import {EstudianteSemestreServiceCreator} from './EstudianteSemestreServiceCreator';
import ServiceTypeEnum from '../../../enum/service-type.enum';
import {ProSemestreService} from '../../../servicios/profesionalizacion/pro-semestre.service';
import {ProMateriaService} from '../../../servicios/profesionalizacion/pro-materia.service';
import {EstudianteService} from '../../../servicios/formacion/estudiante.service';
import {ProMateriaSemestreService} from '../../../servicios/profesionalizacion/pro-materia-semestre.service';
import {ProEstudianteSemestreService} from '../../../servicios/profesionalizacion/pro-estudiante-semestre.service';
import {
  AssociationList,
  AssociationListArray,
  ItemList,
  ItemListArray,
  SelectList,
  SelectListArray
} from '../assign-data.component';
import {EstudianteSemestreMateriaServCreator} from './EstudianteSemestreMateriaServCreator';
import {
  ProEstudianteSemestreMateriaService
} from '../../../servicios/profesionalizacion/pro-estudiante-semestre-materia.service';
import {EstSemMatParaleloServCreator} from './EstSemMatParaleloServCreator';
import {ProEstSemMatParaleloService} from '../../../servicios/profesionalizacion/pro-est-sem-mat-paralelo.service';
import {ProParaleloService} from '../../../servicios/profesionalizacion/pro-paralelo.service';

export interface IApiService {
  idField: string;
  idSelectListFieldId: string;
  idSelectListFieldName: string;
  selectLabel: string;
  getSelectItems(): Observable<SelectListArray>;
  getListItems(): Observable<ItemListArray>;
  createAssignData(selectedItem: number, itemToAssign: AssociationList): void;
  deleteAssignData(itemToAssign: AssociationList): void;
  getAlreadyAddedData(selectedItemId: number): Observable<AssociationListArray>;
  getFieldLabel(item: ItemList): string;
}
@Injectable({
  providedIn: 'root'
})

// tslint:disable:max-line-length
export class ApiServiceFactoryImpl extends ApiServiceFactory {

  constructor(
    private semestreService: ProSemestreService,
    private materiaService: ProMateriaService,
    private paraleloService: ProParaleloService,
    private estudianteService: EstudianteService,
    private materiaSemestreService: ProMateriaSemestreService,
    private estudianteSemestreService: ProEstudianteSemestreService,
    private estudianteSemestreMateriaService: ProEstudianteSemestreMateriaService,
    private estSemMatParaleloService: ProEstSemMatParaleloService,
  ) {
    super();
  }
  createService(type: ServiceTypeEnum): IApiService {
    switch (type) {
      case ServiceTypeEnum.ESTUDIANTE_SEMESTRE:
        return new EstudianteSemestreServiceCreator(this.semestreService, this.estudianteService, this.estudianteSemestreService);
      case ServiceTypeEnum.ESTUDIANTE_SEMESTRE_MATERIA:
        return new EstudianteSemestreMateriaServCreator(this.materiaService, this.estudianteSemestreService, this.estudianteSemestreMateriaService);
      case ServiceTypeEnum.ESTUDIANTE_SEMESTRE_MATERIA_PARALELO:
        return new EstSemMatParaleloServCreator(this.materiaService, this.paraleloService, this.estudianteSemestreService, this.estudianteSemestreMateriaService, this.estSemMatParaleloService)
      default:
        throw new Error('Tipo de servicio no soportado');
    }
  }
}
