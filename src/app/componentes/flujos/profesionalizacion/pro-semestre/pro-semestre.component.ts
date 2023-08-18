import {Component, OnInit, ViewChild} from '@angular/core';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {MdbNotificationRef, MdbNotificationService,} from 'mdb-angular-ui-kit/notification';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Notificacion} from '../../../../util/notificacion';
import {TipoAlerta} from '../../../../enum/tipo-alerta';
import {Semestre} from '../../../../modelo/admin/semestre';
import {ComponenteBase} from '../../../../util/componente-base';
import {ValidacionUtil} from '../../../../util/validacion-util';
import {ProSemestreService} from '../../../../servicios/profesionalizacion/pro-semestre.service';
import {AlertaComponent} from '../../../util/alerta/alerta.component';
import {map} from 'rxjs/operators';
import {OPCIONES_DATEPICKER} from '../../../../util/constantes/opciones-datepicker.const';
import {isEmpty} from 'lodash';

@Component({
  selector: 'app-semestre',
  templateUrl: './pro-semestre.component.html',
  styleUrls: ['./pro-semestre.component.scss'],
})


export class ProSemestreComponent extends ComponenteBase implements OnInit {
  protected readonly opcionesDatepicker = OPCIONES_DATEPICKER;

  semestres: Semestre[];
  semestre: Semestre;
  semestreEditForm: Semestre;


  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;

  // codigo de item a modificar o eliminar
  codigo: number;
  showLoading = false;

  public userResponse: string;
  validacionUtil = ValidacionUtil;

  @ViewChild('table') table!: MdbTableDirective<Semestre>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Nivel', 'Fecha Inicio', 'Fecha Fin', 'Descripcion'];

  constructor(
    private semestreService: ProSemestreService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);

    this.semestres = [];
    this.subscriptions = [];
    this.semestre = {
      codSemestre: 0,
      semestre: '',
      fechaFinSemestre: new Date(),
      fechaInicioSemestre: new Date(),
      descripcion: '',
      estado: 'ACTIVO'
    }
    this.semestreEditForm = {
      codSemestre: 0,
      semestre: '',
      fechaFinSemestre: new Date(),
      fechaInicioSemestre: new Date(),
      descripcion: '',
      estado: 'ACTIVO'
    };
  }

  ngOnInit(): void {
    this.getSemestres();
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  public registro(semestre: Semestre): void {
    semestre = {...semestre, estado: 'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.semestreService.crearSemestre(semestre).subscribe({
        next: (response: HttpResponse<Semestre>) => {
          const nuevaSemestre: Semestre = response.body;
          this.semestres.push(nuevaSemestre);
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Semestre creada con éxito');

          this.semestre = {
            codSemestre: 0,
            semestre: '',
            estado: 'ACTIVO'
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    );
  }

  editRow(index: number) {
    this.editElementIndex = index;
    this.semestreEditForm = {...this.semestres[index]};
    console.log(this.semestreEditForm);
  }

  undoRow() {
    this.semestreEditForm = {
      codSemestre: 0,
      semestre: '',
      estado: 'ACTIVO'
    };
    this.editElementIndex = -1;
  }


  public errorNotification(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensaje,
      TipoAlerta.ALERTA_ERROR
    );
  }

  public actualizar(semestre: Semestre, formValue): void {

    semestre = {...semestre, semestre: formValue.semestre, estado: 'ACTIVO', fechaFinSemestre: formValue.fechaFinSemestre, fechaInicioSemestre: formValue.fechaInicioSemestre, descripcion: formValue.descripcion}

    if (formValue.semestre === '') {
      this.errorNotification('Todos los campos son obligatorios');
      return;
    }

    console.log(semestre);


    this.showLoading = true;
    this.subscriptions.push(
      this.semestreService.actualizarSemestre(semestre, semestre.codSemestre).subscribe({
        next: (response) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Semestre actualizado con éxito');
          this.semestres[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.semestre = {
            codSemestre: 0,
            semestre: '',
            estado: 'ACTIVO'
          }
          this.editElementIndex = -1;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    );
  }

  confirmarEliminar(event: Event, codigo: number): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

  public eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.semestreService.eliminarSemestre(this.codigo).subscribe({
        next: () => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Semestre eliminado con éxito');
          this.showLoading = false;
          const index = this.semestres.findIndex(semestre => semestre.codSemestre === this.codigo);
          this.semestres.splice(index, 1);
          this.semestres = [...this.semestres]
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          console.log(errorResponse);
        },
      })
    );
  }

  private getSemestres() {
    this.semestreService.getSemestre().pipe(
      map(data => data.map(semestre => ({
        ...semestre,
        fechaInicioSemestre: isEmpty(semestre.fechaInicioSemestre) ? semestre.fechaInicioSemestre : new Date(semestre.fechaInicioSemestre),
        fechaFinSemestre: isEmpty(semestre.fechaFinSemestre) ? semestre.fechaFinSemestre : new Date(semestre.fechaFinSemestre),
      })))
    ).subscribe(data => {
      console.log(data)
      this.semestres = data;
    });
  }
}
