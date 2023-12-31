import { MdbNotificationService, MdbNotificationRef } from 'mdb-angular-ui-kit/notification';
import { AlertaComponent } from '../componentes/util/alerta/alerta.component';
import { TipoAlerta } from '../enum/tipo-alerta';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomHttpResponse } from '../modelo/admin/custom-http-response';
import { ValidacionUtil } from './validacion-util';
import { environment } from 'src/environments/environment';
export class Notificacion {
  static ref: MdbNotificationRef<AlertaComponent>;

  static notificar(
    mdbNotificationService: MdbNotificationService,
    mensajeError: String,
    tipoAlerta: TipoAlerta
  ): MdbNotificationRef<AlertaComponent> {
    if (this.ref) {
      this.ref.close;
    }

    this.ref = mdbNotificationService.open(AlertaComponent, {
      data: { mensaje: mensajeError, clase: tipoAlerta },
      autohide: true,
      animation: true,
      position: 'top-center',
      delay: environment.TIEMPO_ALERTA,
      stacking: true,
    });
    return this.ref;
  }

  static notificacionOK(
    notificationRef: MdbNotificationRef<AlertaComponent>,
    notificationService: MdbNotificationService,
    mensaje: string
  ) {
    notificationRef = Notificacion.notificar(notificationService, mensaje, TipoAlerta.ALERTA_OK);
  }

  static notificacion(
    notificationRef: MdbNotificationRef<AlertaComponent>,
    notificationService: MdbNotificationService,
    errorResponse?: HttpErrorResponse,
    mensajeErrorApp?: string
  ) {
    let tipoAlerta: TipoAlerta = TipoAlerta.ALERTA_WARNING;

    let codigoError = -1;
    let mensajeError = 'Error inesperado';

    if (errorResponse) {
      let customError: CustomHttpResponse = errorResponse.error;
      if (customError) {
        mensajeError = ValidacionUtil.isNullOrEmpty(customError.mensaje) ? mensajeError : customError?.mensaje;
      } else {
        mensajeError = errorResponse.message;
      }
      codigoError = errorResponse.status;
    }

    if (!mensajeErrorApp) {
      //mensajeError = 'Error inesperado';
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    } else {
      mensajeError = mensajeErrorApp;
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }

    if (codigoError === 0) {
      mensajeError = 'Error de conexión al servidor';
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }
    notificationRef = Notificacion.notificar(notificationService, mensajeError, tipoAlerta);
  }
}
