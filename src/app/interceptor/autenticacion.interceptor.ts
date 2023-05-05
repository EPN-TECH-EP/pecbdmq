import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../servicios/autenticacion.service';

@Injectable()
export class AutenticacionInterceptor implements HttpInterceptor {

  serviciosPublicosUrls: string[] = 
  ['/usuario/login', 
  '/usuario/registro', 
  '/usuario/resetPassword', 
  '/usuario/guardarArchivo',
  '/usuario/maxArchivo',
];

  constructor(private autenticacionService: AutenticacionService) {}

  intercept(httpRequest: HttpRequest<unknown>, httpHandler: HttpHandler): Observable<HttpEvent<unknown>> {
    /*if (httpRequest.url.includes(`${this.autenticacionService.host}/usuario/login`)) {
      return httpHandler.handle(httpRequest);
    }
    if (httpRequest.url.includes(`${this.autenticacionService.host}/usuario/registro`)) {
      return httpHandler.handle(httpRequest);
    }
    if (httpRequest.url.includes(`${this.autenticacionService.host}/usuario/guardarArchivo`)) {
      return httpHandler.handle(httpRequest);     
    }*/

    if (this.revisaServiciosPublicos(httpRequest.url)) {
      return httpHandler.handle(httpRequest);
    }

    this.autenticacionService.cargaToken();
    const token = this.autenticacionService.getToken();
    const request = httpRequest.clone({ setHeaders: { Authorization: `Bearer ${token}` }});
    return httpHandler.handle(request);
  }


revisaServiciosPublicos(url: string): boolean {
    for (const servicioPublicoUrl of this.serviciosPublicosUrls) {
      if (url.includes(`${this.autenticacionService.host}${servicioPublicoUrl}`)) {
        return true;
      }
    }
    return false;
  }

}

/*import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AutenticacionInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request);
  }
}
*/
