import { TipoPrueba } from '../../modelo/tipo-prueba';
import { TipoPruebaService } from './../../servicios/tipo-prueba.service';
import { Component, OnInit } from '@angular/core';
import { MdbNotificationService, MdbNotificationRef } from 'mdb-angular-ui-kit/notification';
import { Subscription } from 'rxjs';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { ViewChild } from '@angular/core';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { Notificacion } from 'src/app/util/notificacion';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';




@Component({
  selector: 'app-tipo-prueba',
  templateUrl: './tipo-prueba.component.html',
  styleUrls: ['./tipo-prueba.component.scss']
})
export class TipoPruebaComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  tiposprueba: TipoPrueba[];
  public showLoading: boolean;

  options = [
    { value: 'ACTIVO', label: 'ACTIVO' },
    { value: 'INACTIVO', label: 'INACTIVO' },
  ];

  constructor(
    private Api: TipoPruebaService,
    private notificationService: MdbNotificationService
  ) { }

  @ViewChild('table') table!: MdbTableDirective<TipoPrueba>;
  editElementIndex = -1;
  addRow = false;
  Cod_tipo_prueba = '';
  Prueba = '';
  Estado = 'ACTIVO';
  headers = ['TipoPrueba', 'Estado'];

  limpiar() {
    this.Prueba = '';
  }

  addNewRow() {
    const newRow: TipoPrueba = {
      cod_tipo_prueba: this.Cod_tipo_prueba,
      prueba: this.Prueba,
      estado: this.Estado,
    }

    this.tiposprueba = [...this.tiposprueba, { ...newRow }];
    this.Cod_tipo_prueba = '';
    this.Prueba = '';
    this.Estado = 'ACTIVO';
  }

  onDeleteClick(data: TipoPrueba) {
    const index = this.tiposprueba.indexOf(data);
    this.tiposprueba.splice(index, 1);
    this.tiposprueba = [...this.tiposprueba]
  }

  ngOnInit(): void {
    this.Api.getTipoPrueba().subscribe(data => {
      this.tiposprueba = data;
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
    public notificacionOK(mensaje: string) {
      this.notificationRef = Notificacion.notificar(
        this.notificationService,
        mensaje,
        TipoAlerta.ALERTA_OK
      );
  }
  public registro(tipoprueba: TipoPrueba): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.crearTipoPrueba(tipoprueba).subscribe({
        next: (response: HttpResponse<TipoPrueba>) => {
          let nuevaPrueba: TipoPrueba = response.body;
          this.tiposprueba.push(nuevaPrueba);
          this.notificacionOK('Prueba creada con éxito');
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
          // this.showLoading = false;
        },
      })
    );
  }



  public actualizar(tipoprueba: TipoPrueba, codPrueba:any): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizarTipoPrueba(tipoprueba,codPrueba).subscribe({
      next: (response: HttpResponse<TipoPrueba>) => {
        let actualizaPrueba: TipoPrueba = response.body;
        this.notificacionOK('Prueba actualizada con éxito');
        this.editElementIndex=-1;

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

public eliminar(codPrueba: any): void {
this.showLoading = true;
this.subscriptions.push(
  this.Api.eliminarTipoPrueba(codPrueba).subscribe({
    next: (response: string) => {
      this.notificacionOK('Tipo de prueba eliminada con éxito');
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
