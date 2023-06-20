import {UnidadGestion} from '../../modelo/admin/unidad-gestion';
import {Component, OnInit} from '@angular/core';
import {ViewChild} from '@angular/core';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {
  MdbPopconfirmRef,
  MdbPopconfirmService,
} from 'mdb-angular-ui-kit/popconfirm';
import {UnidadGestionService} from 'src/app/servicios/unidad-gestion.service';
import {Observable, Subscription} from 'rxjs';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import {AlertaComponent} from '../util/alerta/alerta.component';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Notificacion} from 'src/app/util/notificacion';
import {TipoAlerta} from 'src/app/enum/tipo-alerta';
import {CustomHttpResponse} from 'src/app/modelo/admin/custom-http-response';
import {HeaderType} from 'src/app/enum/header-type.enum';
import {CambiosPendientes} from 'src/app/modelo/util/cambios-pendientes';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {ComponenteBase} from 'src/app/util/componente-base';
import {ValidacionUtil} from 'src/app/util/validacion-util';

@Component({
  selector: 'app-unidad-gestion',
  templateUrl: './unidad-gestion.component.html',
  styleUrls: ['./unidad-gestion.component.scss'],
})
export class UnidadGestionComponent extends ComponenteBase implements OnInit, CambiosPendientes {
  unidades: UnidadGestion[];
  Unidad: UnidadGestion;
  UnidadEditForm: UnidadGestion;

  //utils
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  //private subscriptions: Subscription[];

  // codigo de item a modificar o eliminar
  codigo: number;
  data: UnidadGestion;
  showLoading = false;

  validacionUtil = ValidacionUtil;

  //options
  options = [
    {value: 'ACTIVO', label: 'ACTIVO'},
    {value: 'INACTIVO', label: 'INACTIVO'},
  ];

  //table
  @ViewChild('table') table!: MdbTableDirective<UnidadGestion>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Nombre'];

  constructor(
    private ApiUnidad: UnidadGestionService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);

    this.unidades = [];
    this.subscriptions = [];
    this.Unidad = {
      codigo: 0,
      nombre: '',
      estado: 'ACTIVO'
    }
    this.UnidadEditForm = {
      codigo: 0,
      nombre: '',
      estado: 'ACTIVO'
    };
  }

  ngOnInit(): void {
    this.ApiUnidad.listar().subscribe((data) => {
      this.unidades = data;
    });
  }
/*
  private notificacion(errorResponse: HttpErrorResponse) {
    let customError: CustomHttpResponse = errorResponse.error;
    let tipoAlerta: TipoAlerta = TipoAlerta.ALERTA_WARNING;

    let mensajeError = customError.mensaje;
    let codigoError = errorResponse.status;

    if (!mensajeError) {
      mensajeError = 'Error inesperado';
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }

    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensajeError,
      tipoAlerta
    );
  }

  public notificacionOk(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }
  */

  //registro
  public registro(unidad: UnidadGestion): void {

    if (unidad.nombre == '') {
      this.errorNotification('Todos los campos deben estar llenos');
      return;
    }

    (unidad = {...unidad, estado: 'ACTIVO'}), (this.showLoading = true);
    this.subscriptions.push(
      this.ApiUnidad.crear(unidad).subscribe({
        next: (response: HttpResponse<UnidadGestion>) => {
          let nuevaUnidad: UnidadGestion = response.body;
          this.unidades.push(nuevaUnidad);
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Unidad de gestión creada con éxito');

          this.Unidad = {
            codigo: 0,
            nombre: '',
            estado: 'ACTIVO'
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
        },
      })
    );
  }

  editRow(index: number) {
    this.editElementIndex = index;
    this.UnidadEditForm = {...this.unidades[index]};
  }

  undoRow() {
    this.UnidadEditForm = {
      codigo: 0,
      nombre: '',
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

  //actualizar
  public actualizar(unidad: UnidadGestion, formValue): void {

    if (formValue.nombre == '') {
      this.errorNotification('Todos los campos deben estar llenos');
      return;
    }

    unidad = {...unidad, nombre: formValue.nombre, estado: 'ACTIVO'};

    this.showLoading = true;
    this.subscriptions.push(
      this.ApiUnidad.actualizar(unidad, unidad.codigo).subscribe({
        next: (response: HttpResponse<UnidadGestion>) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Unidad de gestión actualizada con éxito');
          this.unidades[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.Unidad = {
            codigo: 0,
            nombre: '',
            estado: 'ACTIVO'
          }
          this.editElementIndex = -1;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
          this.showLoading = false;
        },
      })
    );
  }


  //eliminar

  public confirmaEliminar(event: Event, codigo: number, data: UnidadGestion): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    this.data = data;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

  public eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiUnidad.eliminar(this.codigo).subscribe({
        next: (response: string) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Unidad de gestión eliminada con éxito');
          const index = this.unidades.indexOf(this.data);
          this.unidades.splice(index, 1);
          this.unidades = [...this.unidades]
          this.showLoading = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
          console.log(errorResponse);
          this.showLoading = false;
        },
      })
    )
  }

  cambiosPendientes(): boolean {
    return this.editElementIndex !== -1;
  }

  /*canDeactivate(component: CambiosPendientes, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.cambiosPendientes();
  }*/


}
