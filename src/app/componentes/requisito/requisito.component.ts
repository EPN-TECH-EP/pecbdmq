import { MdbNotificationRef, MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { Requisito } from '../../modelo/admin/requisito';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { Subscription } from 'rxjs';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { RequisitoService } from 'src/app/servicios/requisito.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CustomHttpResponse } from 'src/app/modelo/admin/custom-http-response';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { Notificacion } from 'src/app/util/notificacion';
import { Convocatoria } from 'src/app/modelo/admin/convocatoria';
import { ComponenteBase } from 'src/app/util/componente-base';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { ValidacionUtil } from 'src/app/util/validacion-util';

@Component({
  selector: 'app-requisito',
  templateUrl: './requisito.component.html',
  styleUrls: ['./requisito.component.scss']
})

export class RequisitoComponent extends ComponenteBase implements OnInit {
  requisitos: Requisito[];
  requisito: Requisito;
  requisitoEditForm: Requisito;

  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  //private subscriptions: Subscription[] = [];

  // codigo de item a modificar o eliminar
  codigo: number;
  showLoading = false;

  public userResponse: string;

  @ViewChild('table') table!: MdbTableDirective<Requisito>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Nombre','Descripción','Documento'];

  validacionUtil = ValidacionUtil;

  constructor(
    private Api: RequisitoService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
    ) {

      super(notificationServiceLocal, popconfirmServiceLocal);

      this.requisitos= [];
      this.subscriptions = [];
      this.requisito = {
        codigoRequisito:0,
        codFuncionario:0,
        nombre:'',
        descripcion:'',
        esDocumento: '',
        estado:'ACTIVO'
      }
      this.requisitoEditForm = {
        codigoRequisito:0,
        codFuncionario:0,
        nombre:'',
        descripcion:'',
        esDocumento:'',
        estado:'ACTIVO'
      };
    }

    ngOnInit(): void {
      this.Api.getRequisito().subscribe(data => {
        this.requisitos = data;
      })
    }
/*
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
    */
    //registro
    public registro(requisito: Requisito): void {
      requisito={...requisito, estado:'ACTIVO'};
      this.showLoading = true;
      this.subscriptions.push(
        this.Api.crearRequisito(requisito).subscribe({
          next: (response: HttpResponse<Requisito>) => {
            let nuevoRequisito: Requisito = response.body;
            this.requisitos.push(nuevoRequisito);
            Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Requisito creado con éxito');

              this.Api.getRequisito().subscribe(data => {
               this.requisitos = data;
             });
            this.requisito ={
              codigoRequisito:0,
              codFuncionario:0,
              nombre:'',
              descripcion:'',
              esDocumento:'',
              estado:'ACTIVO'
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
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
        codigoRequisito:0,
        codFuncionario:0,
        nombre:'',
        descripcion:'',
        esDocumento:'',
        estado:'ACTIVO'
      };
      this.editElementIndex = -1;
    }



    //actualizar
    public actualizar(requisito: Requisito, formValue): void {

      requisito={...requisito,
        codFuncionario: formValue.codFuncionario,
        nombre: formValue.nombre,
        descripcion: formValue.descripcion,
        esDocumento: formValue.esDocuto,
        estado:'ACTIVO'
      }
      this.showLoading = true;
      this.subscriptions.push(
        this.Api.actualizarRequisito(requisito, requisito.codigoRequisito).subscribe({
        next: (response) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Requisito actualizado con éxito');
          this.requisitos[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.requisito ={
            codigoRequisito:0,
            codFuncionario:0,
            nombre:'',
            descripcion:'',
            esDocumento:'',
            estado:'ACTIVO'
            }
          this.editElementIndex=-1;

        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
        };
      },
     })
    );
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
      this.Api.eliminarRequisito(this.codigo).subscribe({
        next: () => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Requisito eliminado con éxito');
          this.showLoading = false;
          const index = this.requisitos.findIndex(requisito => requisito.codigoRequisito === this.codigo);
          this.requisitos.splice(index, 1);
          this.requisitos = [...this.requisitos]
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
        },
      })
    );
  }



}
