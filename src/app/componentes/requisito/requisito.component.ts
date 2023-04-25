import {MdbNotificationRef, MdbNotificationService} from 'mdb-angular-ui-kit/notification';
import {Requisito} from '../../modelo/admin/requisito';
import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertaComponent} from '../util/alerta/alerta.component';
import {Subscription} from 'rxjs';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {RequisitoService} from 'src/app/servicios/requisito.service';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {CustomHttpResponse} from 'src/app/modelo/admin/custom-http-response';
import {TipoAlerta} from 'src/app/enum/tipo-alerta';
import {Notificacion} from 'src/app/util/notificacion';
import {Convocatoria} from 'src/app/modelo/admin/convocatoria';

@Component({
  selector: 'app-requisito',
  templateUrl: './requisito.component.html',
  styleUrls: ['./requisito.component.scss']
})

export class RequisitoComponent implements OnInit {
  requisitos: Requisito[];
  requisito: Requisito;
  requisitoEditForm: Requisito;

  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  private subscriptions: Subscription[] = [];
  public showLoading: boolean;
  public userResponse: string;

  @ViewChild('table') table!: MdbTableDirective<Requisito>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Nombre', 'Descripción', 'Documento'];


  constructor(
    private Api: RequisitoService,
    private notificationService: MdbNotificationService,
  ) {
    this.requisitos = [];
    this.subscriptions = [];
    this.requisito = {
      codigoRequisito: 0,
      codFuncionario: 0,
      nombre: '',
      descripcion: '',
      esDocumento: '',
      estado: 'ACTIVO'
    }
    this.requisitoEditForm = {
      codigoRequisito: 0,
      codFuncionario: 0,
      nombre: '',
      descripcion: '',
      esDocumento: '',
      estado: 'ACTIVO'
    };
  }

  ngOnInit(): void {
    this.Api.getRequisito().subscribe(data => {
      this.requisitos = data;
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

  //registro
  public registro(requisito: Requisito): void {
    requisito = {...requisito, estado: 'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.crearRequisito(requisito).subscribe({
        next: (response: HttpResponse<Requisito>) => {
          let nuevoRequisito: Requisito = response.body;
          this.requisitos.push(nuevoRequisito);
          this.notificacionOK('Requisito creado con éxito');
          this.Api.getRequisito().subscribe(data => {
            this.requisitos = data;
          });
          this.requisito = {
            codigoRequisito: 0,
            codFuncionario: 0,
            nombre: '',
            descripcion: '',
            esDocumento: '',
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
    this.requisitoEditForm = {...this.requisitos[index]};
  }


  undoRow() {
    this.requisitoEditForm = {
      codigoRequisito: 0,
      codFuncionario: 0,
      nombre: '',
      descripcion: '',
      esDocumento: '',
      estado: 'ACTIVO'
    };
    this.editElementIndex = -1;
  }


  //actualizar
  public actualizar(requisito: Requisito, formValue): void {

    requisito = {
      ...requisito,
      codFuncionario: formValue.codFuncionario,
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      esDocumento: formValue.esDocuto,
      estado: 'ACTIVO'
    }
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizarRequisito(requisito, requisito.codigoRequisito).subscribe({
        next: (response) => {
          this.notificacionOK('Requisito actualizado con éxito');
          this.requisitos[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.requisito = {
            codigoRequisito: 0,
            codFuncionario: 0,
            nombre: '',
            descripcion: '',
            esDocumento: '',
            estado: 'ACTIVO'
          }
          this.editElementIndex = -1;

          error: (errorResponse: HttpErrorResponse) => {
            this.notificacion(errorResponse);
          };
        },
      })
    );
  }


  //eliminar
  public eliminar(codigoRequisito: number): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.eliminarRequisito(codigoRequisito).subscribe({
        next: () => {
          this.notificacionOK('Requisito eliminado con éxito');
          this.showLoading = false;
          const index = this.requisitos.findIndex(requisito => requisito.codigoRequisito === codigoRequisito);
          this.requisitos.splice(index, 1);
          this.requisitos = [...this.requisitos]
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
        },
      })
    );
  }


}
