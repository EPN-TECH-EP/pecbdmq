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

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  private readonly defaultTimeout = environment.DURACION_TIMEOUT; // 30 segundos

  constructor() {}

  /*intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const timeoutValue =
      request.headers.get('timeout') || this.defaultTimeout.toString();

    const timeoutMs = parseInt(timeoutValue, 10);
    const timeout$ = timeout(timeoutMs);

    return next.handle(request).pipe(
      timeout(timeoutMs),
      retryWhen(        
         (errors) =>
        errors.pipe(
          mergeMap((error, index) => {
            if (index < environment.NUMERO_REINTENTOS) {
              // Retry the request after a delay
              return timer(environment.DELAY_REINTENTOS);
            }
            // No more retries, propagate the error
            return throwError(error);
          })
        ) 
      )
    );
  }*/

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
              // Retry the request after a delay
              return timer(environment.DELAY_REINTENTOS);
            }

            console.log('Fin reintentos, sale con error');

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
    // Implement your custom logic to determine if the error is retryable
    // For example, you can check for specific HTTP status codes or error conditions
    console.log('isRetryableError: ' + (error.status >= 500 || error.status == 0));
    return error.status >= 500 || error.status == 0; // Retry for server errors (status code >= 500)
  }

  /* intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      timeout(this.timeoutDuration),
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, index) => {
            if (index < this.maxRetryAttempts) {
              // Retry the request after a delay
              return timer(this.delayBetweenRetries);
            }
            // No more retries, propagate the error
            return throwError(error);
          })
        )
      )
    ); */
}
