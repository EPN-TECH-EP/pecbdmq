import { TipoNotaService } from './../../servicios/tipo-nota.service';
import { TipoNota } from '../../modelo/tipo-nota';
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
  selector: 'app-tipo-nota',
  templateUrl: './tipo-nota.component.html',
  styleUrls: ['./tipo-nota.component.scss']
})
export class TipoNotaComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  tiposnota: TipoNota[];
  public showLoading: boolean;

  options = [
    { value: 'ACTIVO', label: 'ACTIVO' },
    { value: 'INACTIVO', label: 'INACTIVO' },
  ];
  constructor(
    private ApiTipoNota: TipoNotaService,
    private notificationService: MdbNotificationService,
    public Valtiponota:TipoNota
  ) { }
  @ViewChild('table') table!: MdbTableDirective<TipoNota>;
  editElementIndex = -1;
  addRow = false;
  // Cod_tipo_nota = '';
  // Nota = '';
  // Estado = 'ACTIVO';
  headers = ['Nota'];

  addNewRow() {
    const newRow: TipoNota = {
      cod_tipo_nota: this.Valtiponota.cod_tipo_nota,
      nota: this.Valtiponota.nota,
      estado: this.Valtiponota.estado,
    }
    this.tiposnota = [...this.tiposnota, { ...newRow }];
    this.Valtiponota.cod_tipo_nota = '';
    this.Valtiponota.nota = '';
    this.Valtiponota.estado = 'ACTIVO';
  }

  ngOnInit(): void {
    this.Valtiponota.estado = 'ACTIVO';
    this.ApiTipoNota.getTipoNota().subscribe(data => {
      this.tiposnota = data;
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
          this.tiposnota.push(nuevoTipoNota);
          this.notificacionOk('Tipo de nota creado con éxito');
          this.Valtiponota.nota = '';
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
  public actualizar(tiponota: TipoNota, tiponotaId:any): void {
    tiponota={...tiponota, estado:'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiTipoNota.actualizarTipoNota(tiponota,tiponotaId).subscribe({
      next: (response: HttpResponse<TipoNota>) => {
        let actualizaTipoNota: TipoNota = response.body;
        this.notificacionOk('Tipo de nota actualizado con éxito');
        this.editElementIndex=-1;
        this.showLoading = false;
        this.Valtiponota.nota = '';
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
        const index = this.tiposnota.indexOf(data);
        this.tiposnota.splice(index, 1);
        this.tiposnota = [...this.tiposnota]
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
