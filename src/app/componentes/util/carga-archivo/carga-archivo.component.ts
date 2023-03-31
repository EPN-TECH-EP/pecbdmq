import {
  HttpEvent,
  HttpEventType,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import { Subscription } from 'rxjs';
import { FileUploadStatus } from 'src/app/modelo/util/file-upload-status';
import { AlertaComponent } from '../alerta/alerta.component';
import { CargaArchivoService } from '../../../servicios/carga-archivo';
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { Notificacion } from 'src/app/util/notificacion';

@Component({
  selector: 'app-carga-archivo',
  templateUrl: './carga-archivo.component.html',
  styleUrls: ['./carga-archivo.component.scss'],
})
export class CargaArchivoComponent implements OnInit {
  public fileStatus = new FileUploadStatus();
  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;

  public fileName: string;
  public profileImage: File;

  private maxArchivo: number = 0;

  constructor(
    private cargaArchivoService: CargaArchivoService,
    private notificationService: MdbNotificationService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cargaArchivoService.maxArchivo().subscribe({
        next: (result) => {
          this.maxArchivo = result;
        },
        error: (errorResponse) => {
          console.log(errorResponse);
        },
      })
    );
  }

  cargarArchivo() {
    if (this.profileImage !== undefined) {
      if (this.profileImage.size > this.maxArchivo) {
        this.notificacion(null, 'Archivo excede el tamaño máximo permitido')
      } else {
        const formData = new FormData();
        formData.append('nombreArchivo', this.fileName);
        formData.append('archivo', this.profileImage);

        this.subscriptions.push(
          this.cargaArchivoService.cargarArchivo(formData).subscribe({
            next: (event: HttpEvent<any>) => {
              this.reportUploadProgress(event);
            },
            error: (errorResponse) => {
              //console.log(errorResponse);

              this.notificacion(errorResponse);
              this.fileStatus.status = 'done';
            },
          })
        );
      }
    }

    /*this.subscriptions.push(
      this.cargaArchivoService.cargarArchivo(formData).subscribe(
        {
          next: (response) => {
            this.notificacionOK(            
              response.mensaje
            );
          }
          , error: (errorResponse) => {

            console.log(errorResponse);

            this.notificacion(errorResponse);
          this.fileStatus.status = 'done';
          }
        }
      ))*/
  }

  private reportUploadProgress(event: HttpEvent<any>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.fileStatus.percentage = Math.round(
          (100 * event.loaded) / event.total
        );
        this.fileStatus.status = 'progress';
        break;
      case HttpEventType.Response:
        if (event.status === 200) {
          //this.user.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`;
          this.notificacionOK(`Archivo cargado con éxito`);
          this.fileStatus.status = 'done';
          break;
        } else {
          this.notificacion(
            new HttpErrorResponse({ error: 'Error al cargar el archivo' }),
            `Error al cargar el archivo`
          );
          break;
        }
      default:
        `Finished all processes`;
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
    //console.log(errorResponse);

    let tipoAlerta: TipoAlerta = TipoAlerta.ALERTA_WARNING;
    let mensajeError = 'ERROR';
    let codigoError = 0;
    
    if (errorResponse) {
      let customError: CustomHttpResponse = errorResponse.error;
      mensajeError = customError.mensaje;
      codigoError = errorResponse.status;  
    }
    
    if (mensaje) {
      mensajeError = mensaje;
    }

    if (!mensajeError) {
      mensajeError = 'Error inesperado: ' + codigoError;
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }

    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensajeError,
      tipoAlerta
    );
  }

  public onProfileImageChange(event: any): void {
    //console.log(event.target.files[0]);

    this.fileName = event.target.files[0].name;
    this.profileImage = event.target.files[0];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
