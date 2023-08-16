import {Component, Input, OnInit} from '@angular/core';
import {Semestre} from '../../modelo/admin/semestre';
import {Materia} from '../../modelo/admin/materias';
import {ComponenteBase} from '../../util/componente-base';
import {MdbNotificationService} from 'mdb-angular-ui-kit/notification';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {Observable, of, Subject, switchMap} from 'rxjs';
import {catchError, distinctUntilChanged, tap} from 'rxjs/operators';
import {ApiServiceFactoryImpl, IApiService} from './interface/ApiServiceFactoryImpl';
import ServiceTypeEnum from '../../enum/service-type.enum';
import {Estudiante} from '../../modelo/flujos/Estudiante';
import {MateriaSemestre} from '../../modelo/admin/materias-semestre';
import {EstudianteSemestre} from '../../modelo/admin/estudiante-semestre';
import {EstudianteSemestreMateria} from '../../modelo/admin/profesionalizacion/estudiante-semestre-materia';
import {Paralelo} from '../../modelo/admin/paralelo';
import {isEmpty} from 'lodash';

export type SelectList = Semestre | EstudianteSemestre | Paralelo;
export type SelectListArray = Semestre[] | EstudianteSemestre[] | Paralelo[];
export type AssociationList = MateriaSemestre | EstudianteSemestre | EstudianteSemestreMateria;
export type AssociationListArray = MateriaSemestre[] | EstudianteSemestre[] | EstudianteSemestreMateria[];
export type ItemList = Materia | Estudiante | EstudianteSemestreMateria;
export type ItemListArray = Materia[] | Estudiante[] | EstudianteSemestreMateria[];

@Component({
  selector: 'app-assign-data',
  templateUrl: './assign-data.component.html',
  styleUrls: ['./assign-data.component.scss']
})
export class AssignDataComponent extends ComponenteBase implements OnInit {
  selectedItem: number;
  selectList: any[]; // SelectListArray
  itemList: any[];
  associationList: any[] = [];
  selectChange = new Subject<any>();
  apiService: IApiService;
  @Input() type: ServiceTypeEnum;
  @Input() overrideGetListItems: () => Observable<any>;
  @Input() title: string;

  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
    private apiServiceFactory: ApiServiceFactoryImpl,
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);
    this.handleOnSelectChange()
  }

  ngOnInit(): void {
    this.apiService = this.apiServiceFactory.createService(this.type);
    this.getSelectItems();
    this.getAvailableList();
  }

  public moveItem(item: AssociationList, destino: 'available' | 'added') {
    const index = this.itemList.indexOf(item);
    if (index !== -1) {
      this.itemList.splice(index, 1);
      if (destino === 'added') this.agregarALista(item);
    } else {
      const indexSelect = this.associationList.indexOf(item);
      if (indexSelect !== -1) {
        this.associationList.splice(indexSelect, 1);
        if (destino === 'available') this.deleteFromAlreadyAddedList(item);
      }
    }
  }

  public onSelectChange(event): void {
    this.selectChange.next(event);
    this.apiService.getAlreadyAddedData(event).subscribe((response) =>{
      this.associationList = response;
    });
  }

  private agregarALista(itemToAssign: AssociationList) {
    this.associationList.push(itemToAssign);
    this.apiService.createAssignData(this.selectedItem, itemToAssign);
  }

  private deleteFromAlreadyAddedList(item: AssociationList) {
    this.itemList.push(item);
    this.apiService.deleteAssignData(item)
  }

  private eliminarDuplicados(): void {
    this.itemList = this.itemList.filter((m) =>
      !this.associationList.some((s) => s[this.apiService.idField] === m[this.apiService.idField]));
  }

  private getAvailableList() {
    if (this.overrideGetListItems) {
      this.overrideGetListItems().subscribe(resp => {
        this.itemList = resp
      });
    } else {
      this.apiService.getListItems().subscribe(resp => {
        this.itemList = resp
      });
    }
  }

  private getSelectItems() {
    this.apiService.getSelectItems().subscribe(resp => this.selectList = resp);
  }

  private handleOnSelectChange() {
    this.selectChange.pipe(
      distinctUntilChanged(),
      tap(() => this.getAvailableList()),
      switchMap((event) => this.apiService.getAlreadyAddedData(event).pipe(
        catchError(() => {
          return of([]);
        })
      ))
    ).subscribe((data: any) => {
      if (!isEmpty(data)) {
        this.associationList = data;
        this.eliminarDuplicados();
      }
    });
  }
}
