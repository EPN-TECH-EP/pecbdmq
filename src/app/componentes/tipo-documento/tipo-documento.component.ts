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
import { ComponenteBase } from 'src/app/util/componente-base';
import { ValidacionUtil } from 'src/app/util/validacion-util';

@Component({
  selector: 'app-tipo-documento',
  templateUrl: './tipo-documento.component.html',
  styleUrls: ['./tipo-documento.component.scss']
})
export class TipoDocumentoComponent extends ComponenteBase implements OnInit {
  //model
  tiposDocumento: TipoDocumento[];
  tipoDocumento: TipoDocumento;
  tipoDocumentoEditForm: TipoDocumento;

  //utils
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  //private subscriptions: Subscription[];

  // codigo de item a modificar o eliminar
  codigo: number;
  data: TipoDocumento;
  showLoading = false;

  validacionUtil = ValidacionUtil;

  //options
  options = [
    {value: 'ACTIVO', label: 'ACTIVO'},
    {value: 'INACTIVO', label: 'INACTIVO'},
  ];

  //table
  @ViewChild('table') table!: MdbTableDirective<TipoDocumento>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Tipo Documento'];

  /**
    * Inicializa un nuevo objeto "TipoDocumento" con valores por defecto.
    * 
    * @returns {TipoDocumento} Un objeto "TipoDocumento" con valores predeterminados.
  */
  initializeTipoDocumento(): TipoDocumento {
    return {
      codigoDocumento: 0,
      tipoDocumento: '',
      estado: 'ACTIVO',
    };
  }


  constructor(
    private ApiTipoDocumento: TipoDocumentoService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);

    this.tiposDocumento = [];
    
    this.tipoDocumento = this.initializeTipoDocumento();// Llamada al método initializeTipoDocumento
    this.tipoDocumentoEditForm = this.initializeTipoDocumento();// Llamada al método initializeTipoDocumento
  }

  ngOnInit(): void {
    this.subscriptions.push(
    this.ApiTipoDocumento.getTipoDocumento().subscribe(data => {
      this.tiposDocumento = data;
    })
    );
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
  public registro(tipodocumento: TipoDocumento): void {

    if (tipodocumento.tipoDocumento === '') {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos deben estar llenos');
      return;
    }

    tipodocumento = {...tipodocumento, estado: 'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoDocumento.crearTipoDocumento(tipodocumento).subscribe({
        next: (response: HttpResponse<TipoDocumento>) => {
          let nuevoTipoDocumento: TipoDocumento = response.body;
          this.tiposDocumento.push(nuevoTipoDocumento);
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Tipo de documento creado con éxito');

          this.tipoDocumento = this.initializeTipoDocumento();// Llamada al método initializeTipoDocumento
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);

        },
      })
    );
  }

  editRow(index: number) {
    this.editElementIndex = index;
    this.tipoDocumentoEditForm = {...this.tiposDocumento[index]};
  }

  undoRow() {
    this.tipoDocumentoEditForm = this.initializeTipoDocumento();// Llamada al método initializeTipoDocumento
    this.editElementIndex = -1;
  }

  //actualizar
  public actualizar(tipoDocumento: TipoDocumento, formValue): void {

    tipoDocumento = {...tipoDocumento, tipoDocumento: formValue.nombre, estado: 'ACTIVO'};
    
    if (formValue.nombre === '') {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos deben estar llenos');
      return;
    }

    
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoDocumento.actualizarTipoDocumento(tipoDocumento, tipoDocumento.codigoDocumento).subscribe({
        next: (response: HttpResponse<TipoDocumento>) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Tipo de documento actualizado con éxito');
          this.tiposDocumento[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.tipoDocumento = this.initializeTipoDocumento();// Llamada al método initializeTipoDocumento
          this.editElementIndex = -1;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
          this.showLoading = false;
        },
      })
    );
  }

  // eliminar
  public confirmaEliminar(event: Event, codigo: number, data: TipoDocumento): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    this.data = data;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

  public eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoDocumento.eliminarTipoDocumento(this.codigo).subscribe({
        next: (response: string) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Tipo de documento eliminado con éxito');
          const index = this.tiposDocumento.indexOf(this.data);
          this.tiposDocumento.splice(index, 1);
          this.tiposDocumento = [...this.tiposDocumento]
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

  buscar(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    console.log(searchTerm);
    this.table.search(searchTerm);
  }

}
