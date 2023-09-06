import {Component, OnInit, ViewChild} from '@angular/core';
import {OPCIONES_DATEPICKER} from '../../../../util/constantes/opciones-datepicker.const';
import {MdbNotificationRef, MdbNotificationService} from 'mdb-angular-ui-kit/notification';
import {AlertaComponent} from '../../../util/alerta/alerta.component';
import {ValidacionUtil} from '../../../../util/validacion-util';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Notificacion} from '../../../../util/notificacion';
import {TipoAlerta} from '../../../../enum/tipo-alerta';
import {map} from 'rxjs/operators';
import {isEmpty} from 'lodash';
import {ComponenteBase} from '../../../../util/componente-base';
import {ProPeriodoService} from '../../../../servicios/profesionalizacion/pro-periodo.service';
import {ProPeriodo} from '../../../../modelo/admin/profesionalizacion/pro-periodo';

@Component({
  selector: 'app-pro-periodo',
  templateUrl: './pro-periodo.component.html',
  styleUrls: ['./pro-periodo.component.scss']
})
export class ProPeriodoComponent extends ComponenteBase implements OnInit {
  protected readonly opcionesDatepicker = OPCIONES_DATEPICKER;

  periodos: ProPeriodo[];
  periodo: ProPeriodo;
  periodoEditForm: ProPeriodo;


  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;

  // codigo de item a modificar o eliminar
  codigo: number;
  showLoading = false;


  validacionUtil = ValidacionUtil;

  @ViewChild('table') table!: MdbTableDirective<ProPeriodo>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Nombre promoción', 'Fecha Inicio', 'Fecha Fin'];

  constructor(
    private proPeriodoService: ProPeriodoService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);

    this.periodos = [];
    this.subscriptions = [];
    this.periodo = {
      codigoPeriodo: 0,
      nombrePeriodo: '',
      estado: 'ACTIVO'
    }
    this.periodoEditForm = {
      codigoPeriodo: 0,
      nombrePeriodo: '',
      estado: 'ACTIVO',
      fechaInicio: new Date(),
      fechaFin: new Date()
    };
  }

  ngOnInit(): void {
    this.getPeriodos();
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  public registro(periodo: ProPeriodo): void {
    const startDate = new Date(Date.parse(periodo.fechaInicio.toString()));
    const endDate = new Date(Date.parse(periodo.fechaFin.toString()));

    periodo = {
      nombrePeriodo: periodo.nombrePeriodo,
      fechaFin: new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 2)),
      fechaInicio: new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 2 )),
      estado: 'ACTIVO'
    };

    this.showLoading = true;
    this.subscriptions.push(
      this.proPeriodoService.crear(periodo).subscribe({
        next: (response: HttpResponse<ProPeriodo>) => {
          const nuevoPeriodo: ProPeriodo = response.body;
          this.periodos.push(nuevoPeriodo);
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Periodo creado con éxito');

          this.periodo = {
            codigoPeriodo: 0,
            nombrePeriodo: '',
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
    this.periodoEditForm = {...this.periodos[index]};
  }

  undoRow() {
    this.periodoEditForm = {
      codigoPeriodo: 0,
      nombrePeriodo: '',
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

  public actualizar(periodo: ProPeriodo, formValue): void {

    periodo = {...periodo, nombrePeriodo: formValue.nombrePeriodo, estado: 'ACTIVO', fechaInicio: formValue.fechaInicio, fechaFin: formValue.fechaFin}

    if (formValue.nombrePeriodo === '') {
      this.errorNotification('Todos los campos son obligatorios');
      return;
    }


    this.showLoading = true;
    this.subscriptions.push(
      this.proPeriodoService.actualizar(periodo, periodo.codigoPeriodo).subscribe({
        next: (response) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Periodo actualizado con éxito');
          this.periodos[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.periodo = {
            codigoPeriodo: 0,
            nombrePeriodo: '',
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
      this.proPeriodoService.eliminar(this.codigo).subscribe({
        next: () => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Periodo eliminado con éxito');
          this.showLoading = false;
          const index = this.periodos.findIndex(periodo => periodo.codigoPeriodo === this.codigo);
          this.periodos.splice(index, 1);
          this.periodos = [...this.periodos]
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          console.log(errorResponse);
        },
      })
    );
  }

  private getPeriodos() {
    this.proPeriodoService.listar().pipe(
      map(data => data.map(periodo => ({
        ...periodo,
        fechaInicio: isEmpty(periodo.fechaInicio) ? periodo.fechaInicio : new Date(periodo.fechaInicio),
        fechaFin: isEmpty(periodo.fechaFin) ? periodo.fechaFin : new Date(periodo.fechaFin),
      })))
    ).subscribe(data => {
      console.log(data)
      this.periodos = data;
    });
  }
}
