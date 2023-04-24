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

@Component({
  selector: 'app-tipo-procedencia',
  templateUrl: './tipo-procedencia.component.html',
  styleUrls: ['./tipo-procedencia.component.scss']
})
export class TipoProcedenciaComponent extends ComponenteBase  implements OnInit {
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
   //options
 options = [
  { value: 'ACTIVO', label: 'ACTIVO' },
  { value: 'INACTIVO', label: 'INACTIVO' },
];
//table
@ViewChild('table') table!: MdbTableDirective<TipoProcedencia>;
editElementIndex = -1;
addRow = false;
headers = ['Nombre'];

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
    this.ApiTipoProcedencia.getTipoProcedencia().subscribe(data => {
      this.tiposProcedencia = data;
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
  //registro
  public registro(tipoprocedencia: TipoProcedencia): void {
    tipoprocedencia={...tipoprocedencia,estado:'ACTIVO'},
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoProcedencia.crearTipoProcedencia(tipoprocedencia).subscribe({
        next: (response: HttpResponse<TipoProcedencia>) => {
          let nuevoTipoProcedencia: TipoProcedencia = response.body;
          this.tiposProcedencia.push(nuevoTipoProcedencia);
          this.notificacionOk('Tipo procedencia creado con éxito');
          this.tipoProcedencia = {
            codigo: 0,
            nombre: '',
            estado: 'ACTIVO'
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
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
    tipoProcedencia = {...tipoProcedencia, nombre: formValue.nombre, estado:'ACTIVO'},
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoProcedencia.actualizarTipoProcedencia(tipoProcedencia,tipoProcedencia.codigo).subscribe({
      next: (response: HttpResponse<TipoProcedencia>) => {
        this.notificacionOk('Tipo procedencia actualizado con éxito');
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
        this.notificacion(errorResponse);
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
    this.ApiTipoProcedencia.eliminarTipoProcedencia(this.codigo).subscribe({
      next: (response: string) => {
        this.notificacionOk('Tipo Procedencia eliminado con éxito');
        const index = this.tiposProcedencia.indexOf(this.data);
        this.tiposProcedencia.splice(index, 1);
        this.tiposProcedencia = [...this.tiposProcedencia]
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
