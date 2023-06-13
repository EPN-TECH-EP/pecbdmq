import { ComponenteNotaService } from './../../servicios/componente-nota.service';
import { ComponenteNota } from '../../modelo/admin/componente-nota';
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
import { CustomHttpResponse } from 'src/app/modelo/admin/custom-http-response';
import { HeaderType } from 'src/app/enum/header-type.enum';
import { ComponenteBase } from 'src/app/util/componente-base';
import { ValidacionUtil } from 'src/app/util/validacion-util';

@Component({
  selector: 'app-componente-nota',
  templateUrl: './componente-nota.component.html',
  styleUrls: ['./componente-nota.component.scss']
})
export class ComponenteNotaComponent extends ComponenteBase implements OnInit {
   //model
   componentesNota: ComponenteNota[];
   componenteNota: ComponenteNota;
   componenteNotaEditForm: ComponenteNota;
   //utils
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  //private subscriptions: Subscription[];

  // codigo de item a modificar o eliminar
  codigo: number;
  data: ComponenteNota;
  showLoading = false;

  validacionUtil = ValidacionUtil;

  //options
 options = [
  { value: 'ACTIVO', label: 'ACTIVO' },
  { value: 'INACTIVO', label: 'INACTIVO' },
  ];

  //table
  @ViewChild('table') table!: MdbTableDirective<ComponenteNota>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Componente Nota'];

  constructor(
    private ApiComponenteNota: ComponenteNotaService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);
    this.showLoading = false;
    this.componentesNota = [];
    this.subscriptions = [];
    this.componenteNota = {
      codComponenteNota: 0,
      nombre: '',
      estado: 'ACTIVO'
    }
    this.componenteNotaEditForm = {
      codComponenteNota: 0,
      nombre: '',
      estado: 'ACTIVO'
    };
   }


  ngOnInit(): void {
    this.ApiComponenteNota.getComponenteNota().subscribe(data => {
      this.componentesNota = data;
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


  public notificacionOk(mensaje: string) {
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
  */

  //registro
  public registro(componenteNota: ComponenteNota): void {

    if(ValidacionUtil.isNullOrEmpty(componenteNota.nombre)){
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos son obligatorios');

      return;
    }


    componenteNota = {...componenteNota, estado: 'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiComponenteNota.crearComponenteNota(componenteNota).subscribe({
        next: (response: HttpResponse<ComponenteNota>) => {
          let nuevoComponenteNota: ComponenteNota = response.body;
          this.componentesNota.push(nuevoComponenteNota);
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Componente nota creado con éxito');

          this.componenteNota = {
            codComponenteNota: 0,
            nombre: '',
            estado: 'ACTIVO'
          }

          this.addRow = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);

        },
      })
    );
  }

  editRow(index: number) {
    this.editElementIndex = index;
    this.componenteNotaEditForm = {...this.componentesNota[index]};
  }

  undoRow() {
    this.componenteNotaEditForm = {
      codComponenteNota: 0,
      nombre: '',
      estado: 'ACTIVO'
    };
    this.editElementIndex = -1;
  }
  //actualizar
  public actualizar(componenteNota: ComponenteNota, formValue): void {

    componenteNota={...componenteNota, nombre:formValue.componentenota, estado:'ACTIVO'};
    
    if(ValidacionUtil.isNullOrEmpty(formValue.componentenota)){
      Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, 'Todos los campos son obligatorios');
      
      return;
    }

    
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiComponenteNota.actualizarComponenteNota(componenteNota, componenteNota.codComponenteNota).subscribe({
      next: (response: HttpResponse<ComponenteNota>) => {
        Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Componente nota actualizado con éxito');
        this.componentesNota[this.editElementIndex] = response.body;
          this.showLoading = false;
          this.componenteNota = {
            codComponenteNota: 0,
            nombre: '',
            estado: 'ACTIVO'
          }
          this.editElementIndex = -1;
      },
      error: (errorResponse: HttpErrorResponse) => {
        Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
        this.showLoading = false;
      },
    })
    );
  }

  //eliminar

  public confirmaEliminar(event: Event, codigo: number, componenteNota: ComponenteNota): void {
    super.confirmaEliminarMensaje();
    this.codigo = codigo;
    this.data = componenteNota;
    super.openPopconfirm(event, this.eliminar.bind(this));
  }

  public eliminar(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiComponenteNota.eliminarComponenteNota(this.codigo).subscribe({
        next: (response: string) => {
          Notificacion.notificacionOK(this.notificationRef, this.notificationServiceLocal, 'Componente nota eliminado con éxito');

          const index = this.componentesNota.indexOf(this.data);
          this.componentesNota.splice(index, 1);
          this.componentesNota = [...this.componentesNota]
          this.showLoading = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal,errorResponse);
          console.log(errorResponse);
          this.showLoading = false;
        },
      })
    );
  }

}
