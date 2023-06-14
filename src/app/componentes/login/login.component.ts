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
import { ComponenteBase } from 'src/app/util/componente-base';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent
  extends ComponenteBase
  implements OnInit, OnDestroy
{
  backgroundImage: string;

  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;

  public showLoading: boolean = false;
  public showLoadingOlvidoPassword: boolean = false;
  //private subscriptions: Subscription[] = [];

  @Output()
  emisor: EventEmitter<boolean>;
  nombreUsuario: any;

  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
    private router: Router,
    private autenticacionService: AutenticacionService
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);
    this.subscriptions = [];
  }

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
      this.notificationServiceLocal,
      mensajeError,
      tipoAlerta
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());

    window.location.reload();
  }

  public onCancelOlvidoPassword(): void {
    this.showLoadingOlvidoPassword = false;
  }

  public onOlvidoPassword(): void {
    if (this.nombreUsuario === '') {
      Notificacion.notificacionOK(
        this.notificationRef,
        this.notificationServiceLocal,
        'Ingresar un usuario para recuperar la contraseña'
      );
      return;
    }

    this.subscriptions.push(
      this.autenticacionService.resetPassword(this.nombreUsuario).subscribe({
        next: (response: CustomHttpResponse) => {
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            response.mensaje
          );
          this.showLoadingOlvidoPassword = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            errorResponse
          );
          this.showLoadingOlvidoPassword = false;
        },
      })
    );
  }

  public confirmaOlvidoPassword(event, nombreUsuario): void {

    console.log(nombreUsuario);

    if (nombreUsuario === '') {
      Notificacion.notificacionOK(
        this.notificationRef,
        this.notificationServiceLocal,
        'Ingresar un usuario para recuperar la contraseña'
      );
      this.showLoadingOlvidoPassword = false;
      return;
    }

    this.mensajeConfirmacion =
      '¿Está seguro que desea recuperar la contraseña del usuario ' +
      nombreUsuario +
      '?';

    this.nombreUsuario = nombreUsuario;

    super.openPopconfirm(event, this.onOlvidoPassword.bind(this), this.onCancelOlvidoPassword.bind(this));
  }
}
