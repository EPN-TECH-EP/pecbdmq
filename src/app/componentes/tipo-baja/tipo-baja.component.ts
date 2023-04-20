import {Component, OnInit, ViewChild} from '@angular/core';
import {ITipoBaja} from "../../modelo/admin/tipo_baja";
import {TipoBajaService} from "../../servicios/tipo-baja.service";
import {MdbNotificationRef, MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {AlertaComponent} from "../util/alerta/alerta.component";
import {MdbTableDirective} from "mdb-angular-ui-kit/table";
import {Subscription} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Notificacion} from "../../util/notificacion";
import {TipoAlerta} from "../../enum/tipo-alerta";
import {CustomHttpResponse} from "../../modelo/admin/custom-http-response";

@Component({
  selector: 'app-tipo-baja',
  templateUrl: './tipo-baja.component.html',
  styleUrls: ['./tipo-baja.component.scss']
})
export class TipoBajaComponent implements OnInit {

  //model
  tiposBaja: ITipoBaja[];
  tipoBaja: ITipoBaja;
  tipoBajaEditForm: ITipoBaja;

  //utils
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  private subscriptions: Subscription[];
  public showLoading: boolean;

  //options
  options = [
    {value: 'ACTIVO', label: 'ACTIVO'},
    {value: 'INACTIVO', label: 'INACTIVO'},
  ];

  //table
  @ViewChild('table') table!: MdbTableDirective<ITipoBaja>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Baja'];

  constructor(
    private apiTipoBaja: TipoBajaService,
    private notificationService: MdbNotificationService) {
    this.tiposBaja = [];
    this.subscriptions = [];
    this.tipoBaja = {
      cod_tipo_baja: 0,
      estado: 'ACTIVO',
      baja: ''
    }
    this.tipoBajaEditForm = {
      cod_tipo_baja: 0,
      estado: 'ACTIVO',
      baja: ''
    };
  }

  ngOnInit(): void {
    this.apiTipoBaja.getTiposBaja().subscribe(data => {
      this.tiposBaja = data;
    })
  }

  public okNotification(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }

  private errorResponseNotification(errorResponse: HttpErrorResponse) {
    let customError: CustomHttpResponse = errorResponse.error;
    let tipoAlerta: TipoAlerta = TipoAlerta.ALERTA_ERROR;
    let messageError = customError.mensaje

    if (!messageError) {
      messageError = 'Error inesperado';
      tipoAlerta = TipoAlerta.ALERTA_ERROR
    }

    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      messageError,
      tipoAlerta
    )
  }

  //create a register of tipo baja
  public createTipoBaja(tipoBaja: ITipoBaja): void {
    tipoBaja = {...tipoBaja, estado: 'ACTIVO'}
    this.showLoading = true;
    this.subscriptions.push(
      this.apiTipoBaja.createTipoBaja(tipoBaja).subscribe({
        next: (response: HttpResponse<ITipoBaja>) => {
          let newTipoBaja: ITipoBaja = response.body;
          this.tiposBaja.push(newTipoBaja);
          this.okNotification('Tipo de baja creado correctamente');
          this.tipoBaja = {
            cod_tipo_baja: 0,
            estado: 'ACTIVO',
            baja: ''
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.errorResponseNotification(errorResponse);
        },
      })
    )
  }

  editRow(index: number) {
    this.editElementIndex = index;
    this.tipoBajaEditForm = {...this.tiposBaja[index]};
  }

  undoRow() {
    this.tipoBajaEditForm = {
      cod_tipo_baja: 0,
      estado: 'ACTIVO',
      baja: ''
    };
    this.editElementIndex = -1;
  }

  //update a register of tipo baja
  public updateTipoBaja(tipoBaja: ITipoBaja, formValue): void {

    tipoBaja = {...tipoBaja, baja: formValue.baja, estado: 'ACTIVO'}

    this.showLoading = true;
    this.subscriptions.push(
      this.apiTipoBaja.updateTipoBaja(tipoBaja, tipoBaja.cod_tipo_baja).subscribe({
        next: (response) => {
          this.okNotification('Tipo de baja actualizado correctamente');
          this.tiposBaja[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.tipoBaja = {
            cod_tipo_baja: 0,
            estado: 'ACTIVO',
            baja: ''
          }
          this.editElementIndex = -1;
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.errorResponseNotification(errorResponse);
        },
      })
    )
  }

  //delete a register of tipo baja
  public deleteTipoBaja(cod_tipo_baja: number): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.apiTipoBaja.deleteTipoBaja(cod_tipo_baja).subscribe({
        next: () => {
          this.okNotification('Tipo de baja eliminado correctamente');
          this.showLoading = false;
          const index = this.tiposBaja.findIndex(tipoBaja => tipoBaja.cod_tipo_baja === cod_tipo_baja);
          this.tiposBaja.splice(index, 1);
          this.tiposBaja = [...this.tiposBaja];
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.errorResponseNotification(errorResponse);
        },
      })
    )
  }

}
