import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import { Subscription } from 'rxjs';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
import { UsuarioFrm } from 'src/app/modelo/util/usuario-frm';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { Notificacion } from 'src/app/util/notificacion';
import { Usuario } from '../../modelo/usuario';
import { AlertaComponent } from '../util/alerta/alerta.component';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;

  public showLoading: boolean;

  constructor(
    public usuarioEnvio: Usuario,
    public usuarioFrm: UsuarioFrm,
    private autenticacionService: AutenticacionService,
    private notificationService: MdbNotificationService
  ) {}



  ngOnInit(): void {}

  registroSubmit(usuario: UsuarioFrm, isValid: boolean) {
    this.showLoading = true;

    this.usuarioFrm = usuario;

    if (isValid) {
      // transforma a tipo compatible para servicio

      this.usuarioEnvio.nombreUsuario = this.usuarioFrm.nombreUsuario;


      this.usuarioEnvio.codDatosPersonales.$nombre = this.usuarioFrm.nombre;
      this.usuarioEnvio.codDatosPersonales.$apellido = this.usuarioFrm.apellido;
      this.usuarioEnvio.codDatosPersonales.$correo_personal =this.usuarioFrm.correoPersonal;

      this.subscriptions.push(
        this.autenticacionService.registro(this.usuarioEnvio).subscribe({
          next: (response: Usuario) => {
            this.notificacionOK(
              `Se ha registrado el usuario: ${usuario.nombreUsuario}. Se ha enviado la contraseña al correo proporcionado`
            );
            this.showLoading = false;
          },

          error: (errorResp: HttpErrorResponse) => {
            this.notificacion(errorResp);
            this.showLoading = false;
          },
        })
      );
    } else {
      console.error('Formulario inválido!!!');
    }
  }

  notificacionOK(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }

  private notificacion(errorResponse?: HttpErrorResponse, mensaje?: string) {
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

    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensajeError,
      tipoAlerta
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
