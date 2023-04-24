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


  @ViewChild('table') table!: MdbTableDirective<TipoInstruccion>;
  editElementIndex = -1;
  addRow = false;
  headers = [
    // 'Codigo Materia',
    'Tipo de Instrucción',
    //'Estado',
  ];


  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
    private Api:TipoInstruccionService
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);
    
    this.tiposInstruccion=[];
    this.subscriptions = [];
    this.notificationRef=null;
    this.tipoInstruccion={
      codigoTipoInstruccion: 0,
      tipoInstruccion:'',
      estado:'ACTIVO'
    }
    this.tipoInstruccionEdit={
      codigoTipoInstruccion: 0,
      tipoInstruccion:'',
      estado:'ACTIVO'
    }
  }
  ngOnInit(): void {
    this.Api.getTipoInstruccion().subscribe(data => {
      this.tiposInstruccion = data;
    });
  }
  addNewRow() {
    const newRow: TipoInstruccion = this.tipoInstruccion;
    this.tiposInstruccion=[...this.tiposInstruccion,{...newRow}]
    this.tipoInstruccion={
      codigoTipoInstruccion: 0,
      tipoInstruccion:'',
      estado:'',
    }

  }

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
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_ERROR
    );
  }

  public registro(tipoInstruccion: TipoInstruccion): void {

    if (tipoInstruccion.tipoInstruccion === '') {
      this.errorNotification('Todos los campos deben estar llenos');
      return;
    }

    tipoInstruccion={...tipoInstruccion,estado:'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.crearTipoInstruccion(tipoInstruccion).subscribe({
        next: (response: HttpResponse<TipoInstruccion>) => {
          let nuevoTipo: TipoInstruccion = response.body;
          this.table.data.push(nuevoTipo);
          this.notificacionOK('Tipo instrucción creada con éxito');
          this.showLoading = false;
          this.tipoInstruccion={
            codigoTipoInstruccion: 0,
            tipoInstruccion:'',
            estado:''
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
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
    this.tipoInstruccionEdit={
      codigoTipoInstruccion: 0,
      tipoInstruccion:'',
      estado:'',
    }
    this.editElementIndex = -1;
  }
  public actualizar(tipoInstruccion: TipoInstruccion, formValue): void {

    if (formValue.tipoInstruccion === '') {
      this.errorNotification('Todos los campos deben estar llenos');
      return;
    }

    tipoInstruccion={...tipoInstruccion,estado:'ACTIVO',tipoInstruccion:formValue.tipoInstruccion};
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizarTipoInstruccion(tipoInstruccion,tipoInstruccion.codigoTipoInstruccion).subscribe({
        next: (response) => {
          this.notificacionOK('Tipo instrucción actualizada con éxito');
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
            this.notificacion(errorResponse);
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
      this.Api.eliminarTipoInstruccion(this.codigo).subscribe({
        next: (response: string) => {
          this.notificacionOK('Tipo instrucción eliminada con éxito');
          this.showLoading = false;
          const index = this.tiposInstruccion.findIndex(tipoInstruccionO=>tipoInstruccionO.codigoTipoInstruccion===this.codigo)
          this.tiposInstruccion.splice(index, 1);
          this.tiposInstruccion = [...this.tiposInstruccion]
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
        },
      })
    );
  }
  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
