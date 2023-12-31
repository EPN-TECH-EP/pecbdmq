import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, mergeMap, retryWhen, timeout } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Notificacion } from '../util/notificacion';
import { MdbNotificationRef, MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { AlertaComponent } from '../componentes/util/alerta/alerta.component';

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  private readonly defaultTimeout = environment.DURACION_TIMEOUT; // 30 segundos

  notificationRefLocal: MdbNotificationRef<AlertaComponent> | null = null;

  constructor(
    private notificationServiceLocal: MdbNotificationService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      timeout(this.defaultTimeout),
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error: HttpErrorResponse, index: number) => {
            if (
              index < environment.NUMERO_REINTENTOS &&
              this.isRetryableError(error)
            ) {
              console.log('Reintentando...');

              Notificacion.notificacion(this.notificationRefLocal, this.notificationServiceLocal, null, 'Se perdió la comunicación con el servidor. Reintentando...');

              // Retry the request after a delay
              return timer(environment.DELAY_REINTENTOS);
            }


            if (this.isRetryableError(error)) {
              console.log('Fin reintentos, sale con error');

              Notificacion.notificacion(this.notificationRefLocal, this.notificationServiceLocal, null, 'Se perdió la comunicación con el servidor. Contacte al administrador.');
            }

            // No more retries or non-retryable error, propagate the error
            return throwError(error);
          })
        )
      ),
      catchError((error: HttpErrorResponse) => {
        console.log('Error en el catchError luego de reintentos');

        // Handle any remaining errors after retry attempts
        return throwError(error);
      })
    );
  }

  private isRetryableError(error: HttpErrorResponse): boolean {
    console.log('Hay reintento: ' + (error.status == 503 || error.status == 0));
    return error.status == 503 || error.status == 0; // Retry for server errors (status code >= 500)
  }


}
