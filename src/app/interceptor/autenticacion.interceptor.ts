import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { SERVICIOS_PUBLICOS_URLS } from '../util/constantes/servicios-publicos.const';
import { environment } from 'src/environments/environment';

@Injectable()
export class AutenticacionInterceptor implements HttpInterceptor {

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

      /*let modifiedReq;
      const key = environment.appKey;

      console.log(httpRequest.url);

      let headersNew = httpRequest.headers.append('X-API-Key', key);

      // append the new headers to the request
      modifiedReq = httpRequest.clone({
        headers: headersNew
      });*/
      
      //httpRequest.headers.append('X-API-Key', key);

      /*if (httpRequest.headers) {
        modifiedReq = httpRequest.clone({
          setHeaders: { ...httpRequest.headers,
            'X-API-Key': key
          }
        });
      } else 
      {
        modifiedReq = httpRequest.clone({
          setHeaders: {
            'X-API-Key': key
          }
        });
      }*/

      
      return httpHandler.handle(httpRequest);
    }

    this.autenticacionService.cargaToken();
    const token = this.autenticacionService.getToken();
    const request = httpRequest.clone({ setHeaders: { Authorization: `Bearer ${token}` }});
    return httpHandler.handle(request);
  }


revisaServiciosPublicos(url: string): boolean {
    for (const servicioPublicoUrl of SERVICIOS_PUBLICOS_URLS) {
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
