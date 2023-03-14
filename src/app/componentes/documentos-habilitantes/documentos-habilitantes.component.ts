import { DocumentosHabilitantes } from './../../modelo/documentos-habilitantes';
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { MdbPopconfirmRef, MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { Subscription } from 'rxjs';
import { MdbNotificationRef, MdbNotificationService, } from 'mdb-angular-ui-kit/notification';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Notificacion } from 'src/app/util/notificacion';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
import { HeaderType } from 'src/app/enum/header-type.enum';
import { DocumentosHabilitantesService } from 'src/app/servicios/documentos-habilitantes.service';
@Component({
  selector: 'app-documentos-habilitantes',
  templateUrl: './documentos-habilitantes.component.html',
  styleUrls: ['./documentos-habilitantes.component.scss']
})
export class DocumentosHabilitantesComponent implements OnInit {



  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  documentoHabilitante: DocumentosHabilitantes[];
  public showLoading: boolean;

  options = [
    { value: 'ACTIVO', label: 'ACTIVO' },
    { value: 'INACTIVO', label: 'INACTIVO' },
  ];
  constructor(
    private Api: DocumentosHabilitantesService,
    private notificationService: MdbNotificationService
  ) { }

  @ViewChild('table') table!: MdbTableDirective<DocumentosHabilitantes>;
  editElementIndex = -1;
  addRow = false;
  Nombre = '';
  Estado = 'ACTIVO';
  headers = ['Documento Habilitante', 'Estado'];



  ngOnInit(): void {
    this.Api.getDocumentosHabilitantes().subscribe(data => {
      this.documentoHabilitante = data;
    })
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



    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensajeError,
      tipoAlerta
    );
  }


  public notificacionOK(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }
  //registro
  public registro(documentosHabilitantes: DocumentosHabilitantes): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.crearDocumentosHabilitantes(documentosHabilitantes).subscribe({
        next: (response: HttpResponse<DocumentosHabilitantes>) => {
          let nuevadocumentosHabilitantes: DocumentosHabilitantes = response.body;
          this.documentoHabilitante.push(nuevadocumentosHabilitantes);
          this.notificacionOK('Documento Habilitante creada con éxito');
          this.Estado ='';
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
        },
      })
    );
  }

  //actualizar
  public actualizar(documentosHabilitantes: DocumentosHabilitantes, CodDocumentoHabilitante:any): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizarDocumentosHabilitantes(documentosHabilitantes, CodDocumentoHabilitante).subscribe({
      next: (response: HttpResponse<DocumentosHabilitantes>) => {
        let actualizaDocumentoHabilitante: DocumentosHabilitantes = response.body;
        this.notificacionOK('Documento Habilitante actualizada con éxito');
        this.editElementIndex=-1;
        this.showLoading = false;
        this.Estado ='';
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.notificacion(errorResponse);
        this.showLoading = false;
      },
    })
    );
  }

  //eliminar

public eliminar(codDocumentoHabilitante: any, data: DocumentosHabilitantes): void {
  this.showLoading = true;
  this.subscriptions.push(
    this.Api.eliminarDocumentosHabilitantes(codDocumentoHabilitante).subscribe({
      next: (response: string) => {
        this.notificacionOK('Documento Habilitante eliminada con éxito');
        const index = this.documentoHabilitante.indexOf(data);
        this.documentoHabilitante.splice(index, 1);
        this.documentoHabilitante = [...this.documentoHabilitante]
        this.showLoading = false;
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.notificacion(errorResponse);
        console.log(errorResponse);
        this.showLoading = false;
      },
    })
  );
}

}