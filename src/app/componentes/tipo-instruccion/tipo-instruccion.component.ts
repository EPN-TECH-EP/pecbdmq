import {Component, OnInit, ViewChild} from '@angular/core';
import {TipoInstruccion} from "../../modelo/tipo_instruccion";
import {Subscription} from "rxjs";
import {MdbNotificationRef, MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {AlertaComponent} from "../util/alerta/alerta.component";
import {MdbTableDirective} from "mdb-angular-ui-kit/table";
import {TipoInstruccionService} from "../../servicios/tipo-instruccion.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {CustomHttpResponse} from "../../modelo/custom-http-response";
import {TipoAlerta} from "../../enum/tipo-alerta";
import {Notificacion} from "../../util/notificacion";
import {Paralelo} from "../../modelo/paralelo/paralelo";


@Component({
  selector: 'app-tipo-instruccion',
  templateUrl: './tipo-instruccion.component.html',
  styleUrls: ['./tipo-instruccion.component.scss']
})
export class TipoInstruccionComponent implements OnInit {
  tiposInstruccion:TipoInstruccion[];
  tipoInstruccion:TipoInstruccion;

  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  private subscriptions: Subscription[] = [];
  public showLoading: boolean;


  options = [
    { value: 'ACTIVO', label: 'ACTIVO' },
    { value: 'INACTIVO', label: 'INACTIVO' },
  ];

  @ViewChild('table') table!: MdbTableDirective<TipoInstruccion>;
  editElementIndex = -1;
  addRow = false;
  headers = [
    // 'Codigo Materia',
    'Tipo de Instrucción',
    //'Estado',
  ];


  constructor(
    private notificationService: MdbNotificationService,
    private Api:TipoInstruccionService
  ) {
    this.tiposInstruccion=[];
    this.subscriptions = [];
    this.notificationRef=null;
    this.tipoInstruccion={
      codigoTipoInstruccion:'',
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
      codigoTipoInstruccion:'',
      tipoInstruccion:'',
      estado:'',
    }

  }

  public notificacionOK(mensaje:string){
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
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
      this.notificationService,
      mensajeError,
      tipoAlerta
    )
  }

  public registro(tipoInstruccion: TipoInstruccion): void {
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
            codigoTipoInstruccion:'',
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
  public actualizar(tipoInstruccion: TipoInstruccion): void {
    tipoInstruccion={...tipoInstruccion,estado:'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizarTipoInstruccion(tipoInstruccion,tipoInstruccion.codigoTipoInstruccion).subscribe({
        next: () => {
          this.notificacionOK('Tipo instrucción actualizada con éxito');
          this.editElementIndex = -1;
          this.showLoading = false;
          this.tipoInstruccion = {
            codigoTipoInstruccion: '',
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

  public eliminar(codTipoInstruccion: any): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.eliminarTipoInstruccion(codTipoInstruccion).subscribe({
        next: (response: string) => {
          this.notificacionOK('Tipo instrucción eliminada con éxito');
          this.showLoading = false;
          const index = this.tiposInstruccion.findIndex(tipoInstruccionO=>tipoInstruccionO.codigoTipoInstruccion===codTipoInstruccion)
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
