import { TipoProcedencia } from '../../modelo/admin/tipo-procedencia';
import { TipoProcedenciaService } from './../../servicios/tipo-procedencia.service';
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { MdbPopconfirmRef, MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { Subscription } from 'rxjs';
import { MdbNotificationRef, MdbNotificationService, } from 'mdb-angular-ui-kit/notification';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Notificacion } from 'src/app/util/notificacion';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { CustomHttpResponse } from 'src/app/modelo/admin/custom-http-response';
import { HeaderType } from 'src/app/enum/header-type.enum';
import { ComponenteBase } from 'src/app/util/componente-base';
import { ValidacionUtil } from 'src/app/util/validacion-util';

@Component({
  selector: 'app-tipo-procedencia',
  templateUrl: './tipo-procedencia.component.html',
  styleUrls: ['./tipo-procedencia.component.scss']
})
export class TipoProcedenciaComponent extends ComponenteBase implements OnInit {
  //model
  tiposProcedencia: TipoProcedencia[];
  tipoProcedencia: TipoProcedencia;
  tipoProcedenciaEditForm: TipoProcedencia;
  //utils
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  //private subscriptions: Subscription[];

  // codigo de item a modificar o eliminar
  codigo: number;
  showLoading = false;
  data: TipoProcedencia;

validacionUtil = ValidacionUtil;

   //options
 options = [
  { value: 'ACTIVO', label: 'ACTIVO' },
  { value: 'INACTIVO', label: 'INACTIVO' },
];

//table
  @ViewChild('table') table!: MdbTableDirective<TipoProcedencia>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Tipo Procedencia'];

  constructor(
    private ApiTipoProcedencia: TipoProcedenciaService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);

    this.tiposProcedencia = [];
    this.subscriptions = [];
    this.tipoProcedencia = {
      codigo: 0,
      nombre: '',
      estado: 'ACTIVO'
    }
    this.tipoProcedenciaEditForm = {
      codigo: 0,
      nombre: '',
      estado: 'ACTIVO'
    };
  }


  ngOnInit(): void {
    this.ApiTipoProcedencia.listar().subscribe(data => {
      this.tiposProcedencia = data;
    })
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

  public errorNotification(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensaje,
      TipoAlerta.ALERTA_ERROR
    );
  }

  */
  //registro
  public registro(tipoprocedencia: TipoProcedencia): void {

    if (tipoprocedencia.nombre === '') {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos deben estar llenos');
      return;
    }

    tipoprocedencia = {...tipoprocedencia, estado: 'ACTIVO'},
      this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoProcedencia.crear(tipoprocedencia).subscribe({
        next: (response: HttpResponse<TipoProcedencia>) => {
          let nuevoTipoProcedencia: TipoProcedencia = response.body;
          this.tiposProcedencia.push(nuevoTipoProcedencia);
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Tipo procedencia creado con éxito');

          this.tipoProcedencia = {
            codigo: 0,
            nombre: '',
            estado: 'ACTIVO'
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
          // this.showLoading = false;
        },
      })
    );
  }

  editRow(index: number) {
    this.editElementIndex = index;
    this.tipoProcedenciaEditForm = {...this.tiposProcedencia[index]};
  }

  undoRow() {
    this.tipoProcedenciaEditForm = {
      codigo: 0,
      nombre: '',
      estado: 'ACTIVO'
    };
    this.editElementIndex = -1;
  }

  //actualizar
  public actualizar(tipoProcedencia: TipoProcedencia, formValue): void {

    
    tipoProcedencia = {...tipoProcedencia, nombre: formValue.nombre, estado: 'ACTIVO'};
    
    if (formValue.nombre === '') {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos deben estar llenos');
      return;
    }

      this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoProcedencia.actualizar(tipoProcedencia, tipoProcedencia.codigo).subscribe({
        next: (response: HttpResponse<TipoProcedencia>) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Tipo procedencia actualizado con éxito');

          this.tiposProcedencia[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.tipoProcedencia = {
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

  public confirmaEliminar(event: Event, codigo: number, data: TipoProcedencia): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    this.data = data;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

  public eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoProcedencia.eliminar(this.codigo).subscribe({
        next: (response: string) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Tipo procedencia eliminado con éxito');
          const index = this.tiposProcedencia.indexOf(this.data);
          this.tiposProcedencia.splice(index, 1);
          this.tiposProcedencia = [...this.tiposProcedencia]
          this.showLoading = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
          console.log(errorResponse);
          this.showLoading = false;
        },
      })
    );
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }


}
