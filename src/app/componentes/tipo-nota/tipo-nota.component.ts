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

@Component({
  selector: 'app-tipo-nota',
  templateUrl: './tipo-nota.component.html',
  styleUrls: ['./tipo-nota.component.scss']
})
export class TipoNotaComponent implements OnInit {
  //model
  tiposNota: TipoNota[];
  tipoNota: TipoNota;
  tipoNotaEditForm: TipoNota;

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
@ViewChild('table') table!: MdbTableDirective<TipoNota>;
editElementIndex = -1;
addRow = false;
headers = ['Nombre'];

  constructor(
    private ApiTipoNota: TipoNotaService,
    private notificationService: MdbNotificationService,
  ) {
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
  public registro(tiponota: TipoNota): void {
    tiponota={...tiponota, estado:'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoNota.crearTipoNota(tiponota).subscribe({
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
    tipoNota={...tipoNota, nota: formValue.nota, estado:'ACTIVO'};
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



  //eliminar

public eliminar(tipoNotaId: any, data: TipoNota): void {
  this.showLoading = true;
  this.subscriptions.push(
    this.ApiTipoNota.eliminarTipoNota(tipoNotaId).subscribe({
      next: (response: string) => {
        this.notificacionOk('Tipo de nota eliminado con éxito');
        const index = this.tiposNota.indexOf(data);
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
