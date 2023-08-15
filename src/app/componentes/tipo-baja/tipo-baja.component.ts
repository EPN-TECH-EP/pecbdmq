import {Component, OnInit, ViewChild} from '@angular/core';
import {TipoBaja} from "../../modelo/admin/tipo_baja";
import {TipoBajaService} from "../../servicios/tipo-baja.service";
import {MdbNotificationRef, MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {AlertaComponent} from "../util/alerta/alerta.component";
import {MdbTableDirective} from "mdb-angular-ui-kit/table";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Notificacion} from "../../util/notificacion";
import {TipoAlerta} from "../../enum/tipo-alerta";
import {CustomHttpResponse} from "../../modelo/admin/custom-http-response";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ComponenteBase} from 'src/app/util/componente-base';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import { ValidacionUtil } from 'src/app/util/validacion-util';

@Component({
  selector: 'app-tipo-baja',
  templateUrl: './tipo-baja.component.html',
  styleUrls: ['./tipo-baja.component.scss']
})
export class TipoBajaComponent extends ComponenteBase implements OnInit {

  codigo: number;
  tiposBaja: TipoBaja[];
  tipoBajaEditForm: TipoBaja;
  tiposBajaForm: FormGroup;
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  showLoading: boolean;

  @ViewChild('table') table!: MdbTableDirective<TipoBaja>;
  editElementIndex = -1;
  addRow = false;
  headers = [
    {key: 'baja', label: 'Baja'},
  ]

  constructor(
    private apiTipoBaja: TipoBajaService,
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private formBuilder: FormBuilder
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);

    this.tiposBaja = [];
    
    this.tipoBajaEditForm = {codTipoBaja: 0, estado: 'ACTIVO', baja: ''};
    this.tiposBajaForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.subscriptions.push(
    this.apiTipoBaja.getTiposBaja().subscribe(data => {
      this.tiposBaja = data;
    })
    );
    this.buildForm();
  }



  private buildForm() {
    this.tiposBajaForm = this.formBuilder.group({
      baja: ['', [Validators.required, Validators.minLength(5)]]
    });
  }




  get bajaField() {
    return this.tiposBajaForm.get('baja');
  }

  

  editRow(index: number) {
    this.editElementIndex = index;
    const offset = this.paginaActual > 0 ? this.indiceAuxRegistro : 0;
    this.tipoBajaEditForm = {...this.tiposBaja[index + offset]};
    this.tiposBajaForm.patchValue(this.tipoBajaEditForm);
  }

  undoRow() {
    this.editElementIndex = -1;
  }

  createTipoBaja(tipoBaja: TipoBaja): void {

    if (ValidacionUtil.tienePropiedadesVacías(tipoBaja).length > 0) {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos deben estar llenos');
      return;
    }

    tipoBaja = {...tipoBaja, estado: 'ACTIVO'}
    this.showLoading = true;
    this.subscriptions.push(
      this.apiTipoBaja.createTipoBaja(tipoBaja).subscribe({
        next: (response: HttpResponse<TipoBaja>) => {
          let newTipoBaja: TipoBaja = response.body;
          this.tiposBaja.push(newTipoBaja);
          this.tiposBaja = [...this.tiposBaja]
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal,'Tipo de baja creado correctamente');
          this.tiposBajaForm.reset();
          this.addRow = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
        },
      })
    )
  }

  updateTipoBaja(tipoBaja: TipoBaja, formValue): void {

    if (ValidacionUtil.tienePropiedadesVacías(formValue).length > 0) {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos deben estar llenos');
      return;
    }

    tipoBaja = {...tipoBaja, baja: formValue.baja, estado: 'ACTIVO'}

    this.showLoading = true;
    this.subscriptions.push(
      this.apiTipoBaja.updateTipoBaja(tipoBaja, tipoBaja.codTipoBaja).subscribe({
        next: (response) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal,'Tipo de baja actualizado correctamente');
          const index = this.editElementIndex + (this.paginaActual > 0 ? this.indiceAuxRegistro : 0);
          this.tiposBaja[index] = response.body;
          this.tiposBaja = [...this.tiposBaja];
          this.showLoading = false;
          this.bajaField?.reset();
          this.editElementIndex = -1;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
        },
      })
    )
  }

  // eliminar
  public confirmaEliminar(event: Event, codigo: number): void {
  super.confirmaEliminarMensaje();
  this.codigo = codigo;
  super.openPopconfirm(event, this.eliminar.bind(this));
  }

  public eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.apiTipoBaja.deleteTipoBaja(this.codigo).subscribe({
        next: () => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal,'Tipo de baja eliminado correctamente');
          this.showLoading = false;
          const index = this.tiposBaja.findIndex(tipoBaja => tipoBaja.codTipoBaja === this.codigo);
          this.tiposBaja.splice(index, 1);
          this.tiposBaja = [...this.tiposBaja];
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
        },
      })
    )
  }

}
