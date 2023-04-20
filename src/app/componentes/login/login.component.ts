import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { Usuario } from '../../modelo/admin/usuario';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HeaderType } from '../../enum/header-type.enum';

import {
  MdbNotificationService,
  MdbNotificationRef,
} from 'mdb-angular-ui-kit/notification';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { TipoAlerta } from '../../enum/tipo-alerta';
import { Notificacion } from '../../util/notificacion';
import { CustomHttpResponse } from '../../modelo/admin/custom-http-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  backgroundImage: string;

  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;

  public showLoading: boolean;
  private subscriptions: Subscription[] = [];

  @Output()
  emisor: EventEmitter<boolean>;

  constructor(
    private notificationService: MdbNotificationService,
    private router: Router,
    private autenticacionService: AutenticacionService
  ) {}

  ngOnInit(): void {
    this.backgroundImage = 'url(/assets/bg.jpg)';

    if (this.autenticacionService.isUsuarioLoggedIn()) {
      this.router.navigate(['/principal']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  public onLogin(usuario: Usuario): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.autenticacionService.login(usuario).subscribe({
        next: (response: HttpResponse<Usuario>) => {
          const token = response.headers.get(HeaderType.JWT_TOKEN);
          this.autenticacionService.guardaToken(token);
          this.autenticacionService.agregaUsuarioACache(response.body);

          this.router.navigateByUrl('/principal');
          this.showLoading = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
          this.showLoading = false;
        },
      })
    );
  }



  private notificacion(errorResponse: HttpErrorResponse) {
    let customError: CustomHttpResponse = errorResponse.error;
    let tipoAlerta: TipoAlerta = TipoAlerta.ALERTA_WARNING;

    let mensajeError = customError.mensaje;
    let codigoError = errorResponse.status;

    if (!mensajeError) {
      mensajeError = 'Error inesperado';
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }

    if (codigoError === 0) {
      mensajeError = 'Error de conexión al servidor';
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }

    if (this.notificationRef) {
      this.notificationRef.close();
    }

    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensajeError,
      tipoAlerta
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());

    window.location.reload();
  }
}
