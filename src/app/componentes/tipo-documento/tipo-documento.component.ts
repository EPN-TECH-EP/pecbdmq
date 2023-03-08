import { TipoDocumento } from './../../modelo/tipo_documento';
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
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
import { HeaderType } from 'src/app/enum/header-type.enum';

@Component({
  selector: 'app-tipo-documento',
  templateUrl: './tipo-documento.component.html',
  styleUrls: ['./tipo-documento.component.scss']
})
export class TipoDocumentoComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  tiposdocumento: TipoDocumento[];
  public showLoading: boolean;

  options = [
    { value: 'ACTIVO', label: 'ACTIVO' },
    { value: 'INACTIVO', label: 'INACTIVO' },
  ];
  constructor(
    private ApiTipoDocumento: TipoDocumentoService,
    private notificationService: MdbNotificationService,
    public Valtipodocumento:TipoDocumento
  ) { }

  @ViewChild('table') table!: MdbTableDirective<TipoDocumento>;
  editElementIndex = -1;
  addRow = false;


  // CodigoDocumento = '';
  // TipoDocumento = '';
  // Estado = 'ACTIVO';
  headers = ['Tipo de Documento', 'Estado'];

  addNewRow() {
    const newRow: TipoDocumento = {
      codigoDocumento: this.Valtipodocumento.codigoDocumento,
      tipoDocumento: this.Valtipodocumento.tipoDocumento,
      estado: this.Valtipodocumento.estado,
    }
    this.tiposdocumento = [...this.tiposdocumento, { ...newRow }];
    this.Valtipodocumento.codigoDocumento = '';
    this.Valtipodocumento.tipoDocumento = '';
    this.Valtipodocumento.estado = 'ACTIVO';
  }

  ngOnInit(): void {
    this.ApiTipoDocumento.getTipoDocumento().subscribe(data => {
      this.tiposdocumento = data;
      console.log(data);
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
  public registro(tipodocumento: TipoDocumento): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoDocumento.crearTipoDocumento(tipodocumento).subscribe({
        next: (response: HttpResponse<TipoDocumento>) => {
          let nuevoTipoDocumento: TipoDocumento = response.body;
          this.tiposdocumento.push(nuevoTipoDocumento);
          this.notificacionOk('Tipo de documento creado con éxito');
          this.Valtipodocumento.tipoDocumento = '';
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);

        },
      })
    );
  }

  //actualizar
  public actualizar(TipoDocumento: TipoDocumento, TipoDocumentoId:any): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoDocumento.actualizarTipoDocumento(TipoDocumento,TipoDocumentoId).subscribe({
      next: (response: HttpResponse<TipoDocumento>) => {
        let actualizaTipoDocumento: TipoDocumento = response.body;
        this.notificacionOk('Tipo de documento actualizado con éxito');
        this.editElementIndex=-1;
        this.Valtipodocumento.tipoDocumento = '';
        this.showLoading = false;
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
        const index = this.tiposdocumento.indexOf(data);
        this.tiposdocumento.splice(index, 1);
        this.tiposdocumento = [...this.tiposdocumento]
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
