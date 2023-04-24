import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TipoBaja} from "../../modelo/admin/tipo_baja";
import {TipoBajaService} from "../../servicios/tipo-baja.service";
import {MdbNotificationRef, MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {AlertaComponent} from "../util/alerta/alerta.component";
import {MdbTableDirective} from "mdb-angular-ui-kit/table";
import {Subscription} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Notificacion} from "../../util/notificacion";
import {TipoAlerta} from "../../enum/tipo-alerta";
import {CustomHttpResponse} from "../../modelo/admin/custom-http-response";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-tipo-baja',
  templateUrl: './tipo-baja.component.html',
  styleUrls: ['./tipo-baja.component.scss']
})
export class TipoBajaComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[];

  tiposBaja         : TipoBaja[];
  tipoBajaEditForm  : TipoBaja;
  tiposBajaForm     : FormGroup;
  notificationRef   : MdbNotificationRef<AlertaComponent> | null = null;
  showLoading       : boolean;

  @ViewChild('table') table!: MdbTableDirective<TipoBaja>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Baja'];

  constructor(
    private apiTipoBaja         : TipoBajaService,
    private notificationService : MdbNotificationService,
    private formBuilder         : FormBuilder
  ) {
    this.tiposBaja = [];
    this.subscriptions = [];
    this.tipoBajaEditForm = {cod_tipo_baja: 0, estado: 'ACTIVO', baja: ''};
    this.tiposBajaForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.apiTipoBaja.getTiposBaja().subscribe(data => {
      this.tiposBaja = data;
    })
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private buildForm() {
    this.tiposBajaForm = this.formBuilder.group({
      baja: ['', [Validators.required, Validators.minLength(5)]]
    });
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

  get bajaField() {
    return this.tiposBajaForm.get('baja');
  }

  okNotification(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }

  editRow(index: number) {
    this.editElementIndex = index;
    this.tipoBajaEditForm = {...this.tiposBaja[index]};
    this.tiposBajaForm.patchValue(this.tipoBajaEditForm)
  }

  undoRow() {
    this.editElementIndex = -1;
  }

  createTipoBaja(tipoBaja: TipoBaja): void {
    tipoBaja = {...tipoBaja, estado: 'ACTIVO'}
    this.showLoading = true;
    this.subscriptions.push(
      this.apiTipoBaja.createTipoBaja(tipoBaja).subscribe({
        next: (response: HttpResponse<TipoBaja>) => {
          let newTipoBaja: TipoBaja = response.body;
          this.tiposBaja.push(newTipoBaja);
          this.okNotification('Tipo de baja creado correctamente');
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.errorResponseNotification(errorResponse);
        },
      })
    )
  }

  updateTipoBaja(tipoBaja: TipoBaja, formValue): void {

    tipoBaja = {...tipoBaja, baja: formValue.baja, estado: 'ACTIVO'}

    this.showLoading = true;
    this.subscriptions.push(
      this.apiTipoBaja.updateTipoBaja(tipoBaja, tipoBaja.cod_tipo_baja).subscribe({
        next: (response) => {
          this.okNotification('Tipo de baja actualizado correctamente');
          this.tiposBaja[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.bajaField?.reset();
          this.editElementIndex = -1;
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.errorResponseNotification(errorResponse);
        },
      })
    )
  }

  deleteTipoBaja(cod_tipo_baja: number): void {
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
