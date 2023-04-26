import {TipoPrueba} from '../../modelo/admin/tipo-prueba';
import {TipoPruebaService} from './../../servicios/tipo-prueba.service';
import {Component, OnInit} from '@angular/core';
import {MdbNotificationService, MdbNotificationRef} from 'mdb-angular-ui-kit/notification';
import {Subscription} from 'rxjs';
import {AlertaComponent} from '../util/alerta/alerta.component';
import {ViewChild} from '@angular/core';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {CustomHttpResponse} from 'src/app/modelo/admin/custom-http-response';
import {TipoAlerta} from 'src/app/enum/tipo-alerta';
import {Notificacion} from 'src/app/util/notificacion';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {ComponenteBase} from 'src/app/util/componente-base';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';


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


  @ViewChild('table') table!: MdbTableDirective<TipoPrueba>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Tipo Prueba'];


  constructor(
    private Api: TipoPruebaService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);

    this.tiposprueba = [];
    this.subscriptions = [];
    this.tipoPrueba = {
      cod_tipo_prueba: 0,
      prueba: '',
      estado: 'ACTIVO'
    };
    this.tipoPruebaEditForm = {
      cod_tipo_prueba: 0,
      prueba: '',
      estado: 'ACTIVO'
    };
  }


  ngOnInit(): void {
    this.Api.getTipoPrueba().subscribe(data => {
      this.tiposprueba = data;

    })
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
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
      this.notificationServiceLocal,
      mensajeError,
      tipoAlerta
    );
  }

  public notificacionOK(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }

  public errorNotification(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensaje,
      TipoAlerta.ALERTA_ERROR
    );
  }

  public registro(tipoPrueba: TipoPrueba): void {

    if (tipoPrueba.prueba === '') {
      this.errorNotification('Todos los campos deben estar llenos');
      return;
    }

    tipoPrueba = {...tipoPrueba, estado: 'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.crearTipoPrueba(tipoPrueba).subscribe({
        next: (response: HttpResponse<TipoPrueba>) => {
          let nuevaPrueba: TipoPrueba = response.body;
          this.tiposprueba.push(nuevaPrueba);
          this.notificacionOK('Prueba creada con éxito');
          this.tipoPrueba = {
            cod_tipo_prueba: 0,
            prueba: '',
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
    this.tipoPruebaEditForm = {...this.tiposprueba[index]};
  }

  undoRow() {
    this.tipoPruebaEditForm = {
      cod_tipo_prueba: 0,
      prueba: '',
      estado: 'ACTIVO'
    };
    this.editElementIndex = -1;
  }


  public actualizar(tipoPrueba: TipoPrueba, formValue): void {

    if (formValue.prueba === '') {
      this.errorNotification('Todos los campos deben estar llenos');
      return;
    }

    tipoPrueba = {...tipoPrueba, prueba: formValue.prueba, estado: 'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizarTipoPrueba(tipoPrueba, tipoPrueba.cod_tipo_prueba).subscribe({
        next: (response) => {
          this.notificacionOK('Prueba actualizada con éxito');
          this.tiposprueba[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.tipoPrueba = {
            cod_tipo_prueba: 0,
            prueba: '',
            estado: 'ACTIVO'
          }
          this.editElementIndex = -1;
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
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
          this.notificacionOK('Tipo de prueba eliminada con éxito');
          this.showLoading = false;
          const index = this.tiposprueba.findIndex(tipoPrueba => tipoPrueba.cod_tipo_prueba === this.codigo);
          this.tiposprueba.splice(index, 1);
          this.tiposprueba = [...this.tiposprueba];
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
        },
      })
    )
  }

}
