import { TipoPrueba } from '../../modelo/admin/tipo-prueba';
import { TipoPruebaService } from './../../servicios/tipo-prueba.service';
import { Component, OnInit } from '@angular/core';
import { MdbNotificationService, MdbNotificationRef } from 'mdb-angular-ui-kit/notification';
import { Subscription } from 'rxjs';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { ViewChild } from '@angular/core';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { CustomHttpResponse } from 'src/app/modelo/admin/custom-http-response';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { Notificacion } from 'src/app/util/notificacion';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ComponenteBase } from 'src/app/util/componente-base';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { ValidacionUtil } from 'src/app/util/validacion-util';

@Component({
  selector: 'app-tipo-prueba',
  templateUrl: './tipo-prueba.component.html',
  styleUrls: ['./tipo-prueba.component.scss']
})
export class TipoPruebaComponent extends ComponenteBase implements OnInit {
  tiposprueba: TipoPrueba[];
  tipoPrueba: TipoPrueba;
  tipoPruebaEditForm: TipoPrueba;


  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  //private subscriptions: Subscription[] = [];

  // codigo de item a modificar o eliminar
  codigo: number;
  showLoading = false;

  validacionUtil = ValidacionUtil;

  @ViewChild('table') table!: MdbTableDirective<TipoPrueba>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Tipo Prueba', '¿Es física?'];

  /**
    * Inicializa un nuevo objeto "TipoPrueba" con valores por defecto.
    *
    * @returns {TipoPrueba} Un objeto "TipoPrueba" con valores predeterminados.
  */
  initializeTipoPrueba(): TipoPrueba {
    return {
      codTipoPrueba: 0,
      tipoPrueba: '',
      estado: 'ACTIVO',
    };
  }



  constructor(
    private Api: TipoPruebaService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);

    this.tiposprueba = [];

    this.tipoPrueba = this.initializeTipoPrueba();// Llamada al método initializeTipoPrueba
    this.tipoPruebaEditForm = this.initializeTipoPrueba();// Llamada al método initializeTipoPrueba
  }


  ngOnInit(): void {
    this.subscriptions.push(
    this.Api.getTipoPrueba().subscribe(data => {
      this.tiposprueba = data;

    })
    );
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }


  public registro(tipoPrueba: TipoPrueba): void {

    if (tipoPrueba.tipoPrueba === '') {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos deben estar llenos');
      return;
    }

    tipoPrueba = {...tipoPrueba, estado: 'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.crearTipoPrueba(tipoPrueba).subscribe({
        next: (response: HttpResponse<TipoPrueba>) => {
          let nuevaPrueba: TipoPrueba = response.body;
          this.tiposprueba.push(nuevaPrueba);
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Prueba creada con éxito');

          this.addRow = false;

          this.tipoPrueba = this.initializeTipoPrueba();// Llamada al método initializeTipoPrueba
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
        },
      })
    );
  }

  editRow(index: number) {
    this.editElementIndex = index;
    this.tipoPruebaEditForm = {...this.tiposprueba[index]};
  }

  undoRow() {
    this.tipoPruebaEditForm = this.initializeTipoPrueba();// Llamada al método initializeTipoPrueba
    this.editElementIndex = -1;
  }


  public actualizar(tipoPrueba: TipoPrueba, formValue: TipoPrueba): void {

    tipoPrueba = {...tipoPrueba, tipoPrueba: formValue.tipoPrueba, estado: 'ACTIVO'};

    if (formValue.tipoPrueba === '') {
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos deben estar llenos');
      return;
    }


    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizarTipoPrueba(tipoPrueba, tipoPrueba.codTipoPrueba).subscribe({
        next: (response) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Prueba actualizada con éxito');

          this.tiposprueba[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.tipoPrueba = this.initializeTipoPrueba();// Llamada al método initializeTipoPrueba
          this.editElementIndex = -1;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
        },
      })
    )
  }


  //eliminar

  public confirmaEliminar(event: Event, codigo: number): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

  public eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.eliminarTipoPrueba(this.codigo).subscribe({
        next: () => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Prueba eliminada con éxito');
          this.showLoading = false;
          const index = this.tiposprueba.findIndex(tipoPrueba => tipoPrueba.codTipoPrueba === this.codigo);
          this.tiposprueba.splice(index, 1);
          this.tiposprueba = [...this.tiposprueba];
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
        },
      })
    )
  }

}
