import {Component, OnInit, ViewChild} from '@angular/core';
import {TipoInstruccion} from "../../modelo/admin/tipo_instruccion";
import {Subscription} from "rxjs";
import {MdbNotificationRef, MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {AlertaComponent} from "../util/alerta/alerta.component";
import {MdbTableDirective} from "mdb-angular-ui-kit/table";
import {TipoInstruccionService} from "../../servicios/tipo-instruccion.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {CustomHttpResponse} from "../../modelo/admin/custom-http-response";
import {TipoAlerta} from "../../enum/tipo-alerta";
import {Notificacion} from "../../util/notificacion";
import {Paralelo} from "../../modelo/admin/paralelo";
import { ComponenteBase } from 'src/app/util/componente-base';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { ValidacionUtil } from 'src/app/util/validacion-util';


@Component({
  selector: 'app-tipo-instruccion',
  templateUrl: './tipo-instruccion.component.html',
  styleUrls: ['./tipo-instruccion.component.scss']
})
export class TipoInstruccionComponent extends ComponenteBase implements OnInit {
  tiposInstruccion:TipoInstruccion[];
  tipoInstruccion:TipoInstruccion;
  tipoInstruccionEdit: TipoInstruccion;

  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  //private subscriptions: Subscription[] = [];

  // codigo de item a modificar o eliminar
  codigo: number;
  showLoading = false;

  validacionUtil = ValidacionUtil;


  @ViewChild('table') table!: MdbTableDirective<TipoInstruccion>;
  editElementIndex = -1;
  addRow = false;
  headers = [
    // 'Codigo Materia',
    'Tipo de Instrucción',
    //'Estado',
  ];

  /**
    * Inicializa un nuevo objeto "TipoInstruccion" con valores por defecto.
    * 
    * @returns {TipoInstruccion} Un objeto "TipoInstruccion" con valores predeterminados.
  */
  initializeTipoInstruccion(): TipoInstruccion {
    return {
      codigoTipoInstruccion: 0,
      tipoInstruccion: '',
      estado: 'ACTIVO',
    };
  }


  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
    private Api:TipoInstruccionService
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);

    this.tiposInstruccion=[];

    this.notificationRef=null;
    this.tipoInstruccion = this.initializeTipoInstruccion();// Llamada al método initializeTipoInstruccion
    this.tipoInstruccionEdit = this.initializeTipoInstruccion();// Llamada al método initializeTipoInstruccion
  }
  ngOnInit(): void {
    this.subscriptions.push(
    this.Api.listar().subscribe(data => {
      this.tiposInstruccion = data;
      })
    );
  }
  addNewRow() {
    const newRow: TipoInstruccion = this.tipoInstruccion;
    this.tiposInstruccion=[...this.tiposInstruccion,{...newRow}]
    this.tipoInstruccion = this.initializeTipoInstruccion();// Llamada al método initializeTipoInstruccion

  }
/*
  public notificacionOK(mensaje:string){
    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
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

    if (codigoError === 0) {
      mensajeError = 'Error de conexión al servidor';
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }
    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensajeError,
      tipoAlerta
    )
  }

  public errorNotification(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensaje,
      TipoAlerta.ALERTA_ERROR
    );
  }
*/
  public registro(tipoInstruccion: TipoInstruccion): void {

    if (tipoInstruccion.tipoInstruccion === '') {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos deben estar llenos');
      return;
    }

    tipoInstruccion={...tipoInstruccion,estado:'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.crear(tipoInstruccion).subscribe({
        next: (response: HttpResponse<TipoInstruccion>) => {
          let nuevoTipo: TipoInstruccion = response.body;
          this.table.data.push(nuevoTipo);
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Tipo instrucción creada con éxito');

          this.addRow = false;

          this.showLoading = false;
          this.tipoInstruccion = this.initializeTipoInstruccion();// Llamada al método initializeTipoInstruccion
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
          //  this.showLoading = false;
        },
      })
    );
  }
  editRow(index: number) {
    this.editElementIndex = index;
    this.tipoInstruccionEdit = {...this.tiposInstruccion[index]};
  }

  undoRow() {
    this.tipoInstruccionEdit = this.initializeTipoInstruccion();// Llamada al método initializeTipoInstruccion
    this.editElementIndex = -1;
  }
  public actualizar(tipoInstruccion: TipoInstruccion, formValue): void {

    tipoInstruccion={...tipoInstruccion,estado:'ACTIVO',tipoInstruccion:formValue.tipoInstruccion};

    if (formValue.tipoInstruccion === '') {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos deben estar llenos');
      return;
    }


    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizar(tipoInstruccion,tipoInstruccion.codigoTipoInstruccion).subscribe({
        next: (response) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Tipo instrucción actualizada con éxito');
          this.tiposInstruccion[this.editElementIndex]=response.body;
          this.editElementIndex = -1;
          this.showLoading = false;
          this.tipoInstruccion = {
            codigoTipoInstruccion: 0,
            tipoInstruccion: '',
            estado: ''
          }
        },

          error: (errorResponse: HttpErrorResponse) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
            // this.showLoading = false;
          },

      })
    );
  }

  // eliminar
public confirmaEliminar(event: Event, codigo: number): void {
  super.confirmaEliminarMensaje();
  this.codigo = codigo;
  super.openPopconfirm(event, this.eliminar.bind(this));
}

  public eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.eliminar(this.codigo).subscribe({
        next: (response: string) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Tipo instrucción eliminada con éxito');
          this.showLoading = false;
          const index = this.tiposInstruccion.findIndex(tipoInstruccionO=>tipoInstruccionO.codigoTipoInstruccion===this.codigo)
          this.tiposInstruccion.splice(index, 1);
          this.tiposInstruccion = [...this.tiposInstruccion]
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
        },
      })
    );
  }
  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }
  
}
