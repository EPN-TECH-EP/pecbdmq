import { TipoDocumento } from '../../modelo/admin/tipo-documento';
import { TipoDocumentoService } from './../../servicios/tipo-documento.service';
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

@Component({
  selector: 'app-tipo-documento',
  templateUrl: './tipo-documento.component.html',
  styleUrls: ['./tipo-documento.component.scss']
})
export class TipoDocumentoComponent implements OnInit {
  //model
  tiposDocumento: TipoDocumento[];
  tipoDocumento: TipoDocumento;
  tipoDocumentoEditForm: TipoDocumento;

  //utils
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  private subscriptions: Subscription[];
  public showLoading: boolean;

  //options
 options = [
  { value: 'ACTIVO', label: 'ACTIVO' },
  { value: 'INACTIVO', label: 'INACTIVO' },
];

  //table
  @ViewChild('table') table!: MdbTableDirective<TipoDocumento>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Tipo Documento'];

  constructor(
    private ApiTipoDocumento: TipoDocumentoService,
    private notificationService: MdbNotificationService
  ) {
    this.tiposDocumento = [];
    this.subscriptions = [];
    this.tipoDocumento = {
      codigoDocumento: 0,
      tipoDocumento: '',
      estado: 'ACTIVO'
    }
    this.tipoDocumentoEditForm = {
      codigoDocumento: 0,
      tipoDocumento: '',
      estado: 'ACTIVO'
    };
   }

  ngOnInit(): void {
    this.ApiTipoDocumento.getTipoDocumento().subscribe(data => {
      this.tiposDocumento = data;
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
      this.notificationService,
      mensajeError,
      tipoAlerta
    );
  }


  public notificacionOk(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
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
  public registro(tipodocumento: TipoDocumento): void {

    if (tipodocumento.tipoDocumento === '') {
      this.errorNotification('Todos los campos deben estar llenos');
      return;
    }

    tipodocumento={...tipodocumento, estado:'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoDocumento.crearTipoDocumento(tipodocumento).subscribe({
        next: (response: HttpResponse<TipoDocumento>) => {
          let nuevoTipoDocumento: TipoDocumento = response.body;
          this.tiposDocumento.push(nuevoTipoDocumento);
          this.notificacionOk('Tipo de documento creado con éxito');
          this.tipoDocumento = {
            codigoDocumento: 0,
            tipoDocumento: '',
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
    this.tipoDocumentoEditForm = {...this.tiposDocumento[index]};
  }

  undoRow() {
    this.tipoDocumentoEditForm = {
      codigoDocumento: 0,
      tipoDocumento: '',
      estado: 'ACTIVO'
    }
    this.editElementIndex = -1;
  }
  //actualizar
  public actualizar(tipoDocumento: TipoDocumento, formValue): void {

    if (formValue.nombre === '') {
      this.errorNotification('Todos los campos deben estar llenos');
      return;
    }

    tipoDocumento={...tipoDocumento, tipoDocumento: formValue.nombre, estado:'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoDocumento.actualizarTipoDocumento(tipoDocumento,tipoDocumento.codigoDocumento).subscribe({
      next: (response: HttpResponse<TipoDocumento>) => {
        this.notificacionOk('Tipo documento actualizado con éxito');
        this.tiposDocumento[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.tipoDocumento = {
            codigoDocumento: 0,
            tipoDocumento: '',
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

  //eliminar

public eliminar(TipoDocumentoId: any, data: TipoDocumento): void {
  this.showLoading = true;
  this.subscriptions.push(
    this.ApiTipoDocumento.eliminarTipoDocumento(TipoDocumentoId).subscribe({
      next: (response: string) => {
        this.notificacionOk('Tipo de documento eliminado con éxito');
        const index = this.tiposDocumento.indexOf(data);
        this.tiposDocumento.splice(index, 1);
        this.tiposDocumento = [...this.tiposDocumento]
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
