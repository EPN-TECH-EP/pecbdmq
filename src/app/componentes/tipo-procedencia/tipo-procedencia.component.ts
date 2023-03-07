import { TipoProcedencia } from './../../modelo/tipo_procedencia';
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
  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  tiposprocedencia: TipoProcedencia[];
  public showLoading: boolean;

  options = [
    { value: 'ACTIVO', label: 'ACTIVO' },
    { value: 'INACTIVO', label: 'INACTIVO' },
  ];
  constructor(
    private ApiTipoProcedencia: TipoProcedenciaService,
    private notificationService: MdbNotificationService
  ) { }

  @ViewChild('table') table!: MdbTableDirective<TipoProcedencia>;
  editElementIndex = -1;
  addRow = false;
  Codigo = '';
  Nombre = '';
  Estado = 'ACTIVO';
  headers = ['Nombre', 'Estado'];

  addNewRow() {
    const newRow: TipoProcedencia = {
      codigo: this.Codigo,
      nombre: this.Nombre,
      estado: this.Estado,
    }
    this.tiposprocedencia = [...this.tiposprocedencia, { ...newRow }];
    this.Codigo = '';
    this.Nombre = '';
    this.Estado = 'ACTIVO';
  }

  ngOnInit(): void {
    this.ApiTipoProcedencia.getTipoProcedencia().subscribe(data => {
      this.tiposprocedencia = data;
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
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoProcedencia.crearTipoProcedencia(tipoprocedencia).subscribe({
        next: (response: HttpResponse<TipoProcedencia>) => {
          let nuevoTipoProcedencia: TipoProcedencia = response.body;
          this.tiposprocedencia.push(nuevoTipoProcedencia);
          this.notificacionOk('Tipo procedencia creado con éxito');
          this.Nombre = '';
          // const token = response.headers.get(HeaderType.JWT_TOKEN);
          // this.aut.guardaToken(token);
          // this.autenticacionService.agregaUsuarioACache(response.body);

          // this.router.navigateByUrl('/principal');
          // this.showLoading = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
          // this.showLoading = false;
        },
      })
    );
  }

  //actualizar
  public actualizar(tipoprocedencia: TipoProcedencia, tipoprocedenciaId:any): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoProcedencia.actualizarTipoProcedencia(tipoprocedencia,tipoprocedenciaId).subscribe({
      next: (response: HttpResponse<TipoProcedencia>) => {
        let actualizaTipoProcedencia: TipoProcedencia = response.body;
        this.notificacionOk('Tipo procedencia actualizado con éxito');
        this.editElementIndex=-1;
        this.showLoading = false;
        this.Nombre = '';
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
        const index = this.tiposprocedencia.indexOf(data);
        this.tiposprocedencia.splice(index, 1);
        this.tiposprocedencia = [...this.tiposprocedencia]
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
