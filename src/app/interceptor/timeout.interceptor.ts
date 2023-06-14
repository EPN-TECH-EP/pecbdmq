import {Injectable} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {timeout} from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  private readonly defaultTimeout = environment.DURACION_TIMEOUT; // 30 segundos

  constructor() {
  }

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
