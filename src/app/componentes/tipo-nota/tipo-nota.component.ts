import { TipoNotaService } from './../../servicios/tipo-nota.service';
import { TipoNota } from '../../modelo/admin/tipo-nota';
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

@Component({
  selector: 'app-tipo-nota',
  templateUrl: './tipo-nota.component.html',
  styleUrls: ['./tipo-nota.component.scss']
})
export class TipoNotaComponent extends ComponenteBase implements OnInit {
  //model
  tiposNota: TipoNota[];
  tipoNota: TipoNota;
  tipoNotaEditForm: TipoNota;

  //utils
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  //private subscriptions: Subscription[];
  
  // codigo de item a modificar o eliminar
  codigo: number;
  showLoading = false;
  data: TipoNota;

  //options
  options = [
    {value: 'ACTIVO', label: 'ACTIVO'},
    {value: 'INACTIVO', label: 'INACTIVO'},
  ];
//table
  @ViewChild('table') table!: MdbTableDirective<TipoNota>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Nombre'];

  constructor(
    private ApiTipoNota: TipoNotaService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);

    this.tiposNota = [];
    this.subscriptions = [];
    this.tipoNota = {
      cod_tipo_nota: 0,
      nota: '',
      estado: 'ACTIVO'
    }
    this.tipoNotaEditForm = {
      cod_tipo_nota: 0,
      nota: '',
      estado: 'ACTIVO'
    };
  }

  ngOnInit(): void {
    this.ApiTipoNota.getTipoNota().subscribe(data => {
      this.tiposNota = data;
    })
  }


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
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_ERROR
    );
  }

  //registro
  public registro(tipoNota: TipoNota): void {

    if(tipoNota.nota === ''){
      this.errorNotification('Todos los campos deben estar llenos');
      return
    }

    tipoNota = {...tipoNota, estado: 'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoNota.crearTipoNota(tipoNota).subscribe({
        next: (response: HttpResponse<TipoNota>) => {
          let nuevoTipoNota: TipoNota = response.body;
          this.tiposNota.push(nuevoTipoNota);
          this.notificacionOk('Tipo de nota creado con éxito');
          this.tipoNota = {
            cod_tipo_nota: 0,
            nota: '',
            estado: 'ACTIVO'
          }

        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);

        },
      })
    );
  }

  editRow(index: number) {
    this.editElementIndex = index;
    this.tipoNotaEditForm = {...this.tiposNota[index]};
  }

  undoRow() {
    this.tipoNotaEditForm = {
      cod_tipo_nota: 0,
      nota: '',
      estado: 'ACTIVO'
    };
    this.editElementIndex = -1;
  }

  //actualizar
  public actualizar(tipoNota: TipoNota, formValue): void {

    if(formValue.nota === ''){
      this.errorNotification('Todos los campos deben estar llenos');
      return
    }

    tipoNota = {...tipoNota, nota: formValue.nota, estado: 'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoNota.actualizarTipoNota(tipoNota, tipoNota.cod_tipo_nota).subscribe({
        next: (response: HttpResponse<TipoNota>) => {
          this.notificacionOk('Tipo de nota actualizado con éxito');
          this.tiposNota[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.tipoNota = {
            cod_tipo_nota: 0,
            nota: '',
            estado: 'ACTIVO'
          }
          this.editElementIndex = -1;

        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
          this.showLoading = false;
        },
      })
    );
  }


// eliminar
public confirmaEliminar(event: Event, codigo: number, data: TipoNota): void {
  super.confirmaEliminarMensaje();
  this.codigo = codigo;
this.data = data;
  super.openPopconfirm(event, this.eliminar.bind(this));
}

public eliminar(): void {
  this.showLoading = true;
  this.subscriptions.push(
    this.ApiTipoNota.eliminarTipoNota(this.codigo).subscribe({
      next: (response: string) => {
        this.notificacionOk('Tipo de nota eliminado con éxito');
        const index = this.tiposNota.indexOf(this.data);
        this.tiposNota.splice(index, 1);
        this.tiposNota = [...this.tiposNota]
        this.showLoading = false;
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.notificacion(errorResponse);
        console.log(errorResponse);
        this.showLoading = false;
      },
    })
  );
}

}
