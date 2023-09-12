import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import { AlertaComponent } from '../componentes/util/alerta/alerta.component';
import { Subscription } from 'rxjs';
import { Directive, OnDestroy } from '@angular/core';
import { MdbPopconfirmRef, MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { PopconfirmComponent } from '../componentes/util/popconfirm/popconfirm.component';
import {MdbPaginationChange} from "../../../code/mdb-angular-ui-kit/table";
import { ValidacionUtil } from './validacion-util';
import { SubtipoPrueba } from '../modelo/admin/subtipo-prueba';

@Directive()
export class ComponenteBase implements OnDestroy {
  protected subscriptions: Subscription[] = [];
  protected notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  public showLoading: boolean = false;

  paginaActual: number = 0;
  entradasPorPagina: number = 0;
  indiceAuxRegistro: number = 0;

  private notificationService: MdbNotificationService;

  // confirmar acciones: elimiar y editar
  private popconfirmService: MdbPopconfirmService
  popconfirmRef: MdbPopconfirmRef<PopconfirmComponent> | null = null;
  mensajeConfirmacion: string;
  mostrarConfirmacion:boolean = false;

  // util genérico
  validacionUtil = ValidacionUtil;

  constructor(notificationService: MdbNotificationService,
    popconfirmService: MdbPopconfirmService) {
    this.notificationService = notificationService;
    this.popconfirmService = popconfirmService;
    this.showLoading = false;
    this.subscriptions = [];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // confirmar acciones: elimiar y editar
  confirmaActualizarMensaje(){
    this.mensajeConfirmacion = '¿Actualizar los datos?';
  }

  confirmaEliminarMensaje(){
    this.mensajeConfirmacion = '¿Eliminar el registro? Esta acción es irreversible';
  }

  confirmaEnvioNotificacion(){
    this.mensajeConfirmacion = '¿Desea enviar la notificación?';
  }

  confirmarReasignacionMensaje(){
    this.mensajeConfirmacion = '¿Reasignar la inscripción?';
  }

  // Funcionalidad de confirmación

  openPopconfirm(event: Event, confirmCallback: () => void, cancelCallback?: () => void) {

    const target = event.target as HTMLElement;

    this.popconfirmRef = this.popconfirmService.open(
      PopconfirmComponent,
      target,
      { popconfirmMode: 'modal', data: { mensaje: this.mensajeConfirmacion } }
    );

    this.subscriptions.push(
    this.popconfirmRef.onClose.subscribe((message: any) => {
      // cancela acción

      if(cancelCallback != null){
        cancelCallback();
      }

      return false;
    })
    );

    this.popconfirmRef.onConfirm.subscribe((message: any) => {
      //confirma acción
      confirmCallback();
      return true;
    });

  }

  onPaginationChange(event: MdbPaginationChange): void {
    this.paginaActual = event.page;
    this.entradasPorPagina = event.entries;
    if (this.paginaActual > 0) {
      this.indiceAuxRegistro = this.paginaActual * this.entradasPorPagina;
    }
  }

}
