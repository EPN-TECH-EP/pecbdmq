import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  private readonly defaultTimeout = 30000; // 30 segundos

  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const timeoutValue =
      request.headers.get('timeout') || this.defaultTimeout.toString();

    const timeoutMs = parseInt(timeoutValue, 10);
    const timeout$ = timeout(timeoutMs);

    return next.handle(request).pipe(timeout(timeoutMs));

    /* return next.handle(request).pipe(
      timeout$,
      catchError((error: HttpErrorResponse) => {
        if (error.name.includes("TimeoutError")) {
          console.error(`Request timed out after ${timeoutMs} ms.`, request);
        }
        return throwError(error);
      })
    ); */
  }
}
