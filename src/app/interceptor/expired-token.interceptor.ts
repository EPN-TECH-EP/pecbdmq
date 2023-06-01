import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalSesionExpiradaComponent } from '../componentes/util/modal-sesion-expirada/modal-sesion-expirada.component';
import { SERVICIOS_PUBLICOS_URLS } from '../util/constantes/servicios-publicos.const';
import { AutenticacionService } from '../servicios/autenticacion.service';

@Injectable({
  providedIn: 'root',
})
export class ExpiredTokenInterceptor implements HttpInterceptor {
  sesionExpiradaModalRef: MdbModalRef<ModalSesionExpiradaComponent>;
  public static globalModalRef: MdbModalRef<any>;
  private showModal = false;

  constructor(
    private router: Router,
    private modalService: MdbModalService,
    private autenticacionService: AutenticacionService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Verifica urls públicas

    if (this.revisaServiciosPublicos(req.url)) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 403 && !this.showModal) {
          this.showModal = true;
          this.abrirModalSesionExpirada();
          return EMPTY;
        }
        return throwError(() => err);
      })
    );
  }

  abrirModalSesionExpirada() {
    if (ExpiredTokenInterceptor.globalModalRef) {
      ExpiredTokenInterceptor.globalModalRef.close();
    }

    this.sesionExpiradaModalRef = this.modalService.open(
      ModalSesionExpiradaComponent,
      {
        modalClass: '.modal-sm modal-dialog-centered',
      }
    );

    this.sesionExpiradaModalRef.onClose.subscribe(() => {
      this.router.navigate(['/login']).then(() => {
        //window.location.reload()
      });
    });
  }

  revisaServiciosPublicos(url: string): boolean {
    for (const servicioPublicoUrl of SERVICIOS_PUBLICOS_URLS) {
      if (
        url.includes(`${this.autenticacionService.host}${servicioPublicoUrl}`)
      ) {
        return true;
      }
    }
    return false;
  }
}
