import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {EMPTY, Observable, throwError} from "rxjs";
import {Router} from "@angular/router";
import {catchError} from "rxjs/operators";
import {MdbModalRef, MdbModalService} from "mdb-angular-ui-kit/modal";
import {ModalSesionExpiradaComponent} from "../componentes/util/modal-sesion-expirada/modal-sesion-expirada.component";

@Injectable({
  providedIn: 'root'
})
export class ExpiredTokenInterceptor implements HttpInterceptor {

  sesionExpiradaModalRef: MdbModalRef<ModalSesionExpiradaComponent>;
  private showModal = false;

  constructor(
    private router: Router,
    private modalService: MdbModalService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // this.modalRef.close()
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
    this.sesionExpiradaModalRef = this.modalService.open(ModalSesionExpiradaComponent, {
      modalClass: '.modal-sm modal-dialog-centered',
    });

    this.sesionExpiradaModalRef.onClose.subscribe(() => {
      this.router.navigate(['/login']).then(() => {
        window.location.reload()
      });
    });
  }

}

