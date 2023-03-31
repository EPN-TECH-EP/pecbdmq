import { TipoProcedencia } from '../../modelo/tipo-procedencia';
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
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
import { HeaderType } from 'src/app/enum/header-type.enum';

@Component({
  selector: 'app-tipo-procedencia',
  templateUrl: './tipo-procedencia.component.html',
  styleUrls: ['./tipo-procedencia.component.scss']
})
export class TipoProcedenciaComponent implements OnInit {
   //model
   tiposProcedencia: TipoProcedencia[];
   tipoProcedencia: TipoProcedencia;
   tipoProcedenciaEditForm: TipoProcedencia;
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
@ViewChild('table') table!: MdbTableDirective<TipoProcedencia>;
editElementIndex = -1;
addRow = false;
headers = ['Nombre'];

  constructor(
    private ApiTipoProcedencia: TipoProcedenciaService,
    private notificationService: MdbNotificationService,
  ) {
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

public eliminar(tipoProcedenciaId: any, data: TipoProcedencia): void {
  this.showLoading = true;
  this.subscriptions.push(
    this.ApiTipoProcedencia.eliminarTipoProcedencia(tipoProcedenciaId).subscribe({
      next: (response: string) => {
        this.notificacionOk('Tipo Procedencia eliminado con éxito');
        const index = this.tiposProcedencia.indexOf(data);
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
