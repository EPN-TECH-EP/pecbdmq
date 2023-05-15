import {MateriaService} from './../../servicios/materia.service';
import {MateriasTbl} from './../../modelo/util/materias-tbl';
import {HttpErrorResponse, HttpResponse, HttpClient} from '@angular/common/http';
import {Component, OnInit, OnDestroy, Inject, Injectable} from '@angular/core';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import {Subscription} from 'rxjs';
import {TipoAlerta} from 'src/app/enum/tipo-alerta';
import {CustomHttpResponse} from 'src/app/modelo/admin/custom-http-response';
import {AutenticacionService} from 'src/app/servicios/autenticacion.service';
import {Notificacion} from '../../util/notificacion';
import {ViewChild} from '@angular/core';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {Materia} from 'src/app/modelo/admin/materias';
import {
  MdbPopconfirmRef,
  MdbPopconfirmService,
} from 'mdb-angular-ui-kit/popconfirm';
import {AlertaComponent} from '../util/alerta/alerta.component';
import {ComponenteBase} from 'src/app/util/componente-base';
import {ValidacionUtil} from 'src/app/util/validacion-util';


@Component({
  selector: 'app-materia',
  templateUrl: './materia.component.html',
  styleUrls: ['./materia.component.scss'],
})
// @Injectable()
// export class MaService {
//   constructor(private valueService: ValueService) { }
//   getValue() { return this.valueService.getValue(); }
// }
export class MateriaComponent extends ComponenteBase implements OnInit {
  materias: Materia[];
  materia: Materia;
  materiaEditForm: Materia;
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  // codigo de item a modificar o eliminar
  codigo: number;
  showLoading = false;
  validacionUtil = ValidacionUtil;
  userResponse: string;

  @ViewChild('table') table!: MdbTableDirective<Materia>;
  editElementIndex = -1;
  addRow = false;
  headers = [
    'Nombre Materia',
    'Número de Horas',
    'Tipo de Materia',
    'Observacion Materia',
    'Peso Materia',
    'Nota Mínima',
  ];

  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private materiaService: MateriaService) {
    super(notificationServiceLocal, popConfirmServiceLocal);
    this.showLoading = false;
    this.materias = [];
    this.subscriptions = [];
    this.materia = {
      codMateria: 0,
      nombre: '',
      numHoras: '' as any,
      tipoMateria: '',
      observacionMateria: '',
      pesoMateria: '' as any,
      notaMinima: '' as any,
      estado: 'ACTIVO'
    }
    this.materiaEditForm = {
      codMateria: 0,
      nombre: '',
      numHoras: '' as any,
      tipoMateria: '',
      observacionMateria: '',
      pesoMateria: '' as any,
      notaMinima: '' as any,
      estado: 'ACTIVO'
    }

  }

  ngOnInit(): void {
    this.materiaService.getMaterias().subscribe((data) => {
      this.materias = data;
    });
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  editRow(index: number) {
    this.editElementIndex = index;
    const offset = this.paginaActual > 0 ? this.indiceAuxRegistro : 0;
    this.materiaEditForm = {...this.materias[index + offset]};
  }

  undoRow() {
    this.materiaEditForm = {
      codMateria: 0,
      nombre: '',
      numHoras: '' as any,
      tipoMateria: '',
      observacionMateria: '',
      pesoMateria: '' as any,
      notaMinima: '' as any,
      estado: 'ACTIVO'
    };
    this.editElementIndex = -1;
  }

  crear(materia: Materia): void {

    if (
      materia.nombre == '' ||
      ValidacionUtil.isNullOrEmptyNumber(materia.numHoras) ||
      materia.tipoMateria == '' ||
      materia.observacionMateria == '' ||
      ValidacionUtil.isNullOrEmptyNumber(materia.pesoMateria) ||
      ValidacionUtil.isNullOrEmptyNumber(materia.notaMinima)) {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos deben estar llenos');
      return
    }

    materia = {...materia, estado: 'ACTIVO'};
    this.showLoading = true;
    this.userResponse = 'Lunes';
    this.subscriptions.push(
      this.materiaService.registroMateria(materia).subscribe({
        next: (response: HttpResponse<Materia>) => {
          let nuevaMateria: Materia = response.body;
          this.materias.push(nuevaMateria);
          this.materias = [...this.materias]
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Materia creada con éxito');

          this.materia = {
            codMateria: 0,
            nombre: '',
            numHoras: '' as any,
            tipoMateria: '',
            observacionMateria: '',
            pesoMateria: '' as any,
            notaMinima: '' as any,
            estado: 'ACTIVO'
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    )
  }

  actualizar(materia: Materia, formValue): void {

    if (
      formValue.nombre == '' ||
      ValidacionUtil.isNullOrEmptyNumber(formValue.numHoras) ||
      formValue.tipoMateria == '' ||
      formValue.observacionMateria == '' ||
      ValidacionUtil.isNullOrEmptyNumber(formValue.pesoMateria) ||
      ValidacionUtil.isNullOrEmptyNumber(formValue.notaMinima)) {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos deben estar llenos');
      return
    }

    materia = {
      ...materia,
      nombre: formValue.nombre,
      numHoras: formValue.numHoras,
      tipoMateria: formValue.tipoMateria,
      observacionMateria: formValue.observacionMateria,
      pesoMateria: formValue.pesoMateria,
      notaMinima: formValue.notaMinima,
      estado: 'ACTIVO'
    }
    this.showLoading = true;
    this.subscriptions.push(
      this.materiaService.actualizarMateria(materia, materia.codMateria).subscribe({
          next: (response) => {
            Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Materia actualizada con éxito');

            const index = this.editElementIndex + (this.paginaActual > 0 ? this.indiceAuxRegistro : 0);
            this.materias[index] = response.body;
            this.showLoading = false;
            this.materia = {
              codMateria: 0,
              nombre: '',
              numHoras: '' as any,
              tipoMateria: '',
              observacionMateria: '',
              pesoMateria: '' as any,
              notaMinima: '' as any,
              estado: 'ACTIVO'
            }
            this.editElementIndex = -1;
            this.materias = [...this.materias]

          },

          error: (errorResponse: HttpErrorResponse) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          }
        },
      )
    );
  }

  confirmarEliminar(event: Event, codigo: number): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

  eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.materiaService.eliminarMateria(this.codigo).subscribe({
        next: (response: string) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Materia eliminada con éxito');

          this.showLoading = false;
          const index = this.materias.findIndex(materia => materia.codMateria === this.codigo);
          this.materias.splice(index, 1);
          this.materias = [...this.materias]
          this.showLoading = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    );
  }
}
