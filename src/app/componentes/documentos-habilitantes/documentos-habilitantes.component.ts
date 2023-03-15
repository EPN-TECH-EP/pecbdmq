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

  documentosHabilitante: DocumentosHabilitantes[];
  documentohabilitantes: DocumentosHabilitantes;
  documentoHabilitanteEditForm: DocumentosHabilitantes;


  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  private subscriptions: Subscription[] = [];
  public showLoading: boolean;



  @ViewChild('table') table!: MdbTableDirective<DocumentosHabilitantes>;
  editElementIndex = -1;
  addRow = false;
  headers = ['Documento Habilitante'];


  constructor(
    private Api: DocumentosHabilitantesService,
    private notificationService: MdbNotificationService) {
    this.documentosHabilitante = [];
    this.subscriptions = [];
    this.documentohabilitantes = {
      codDocumentoHabilitante: 0,
      nombre: '',
      estado: 'ACTIVO',

    }
    this.documentoHabilitanteEditForm = {
      codDocumentoHabilitante: 0,
      nombre: '',
      estado: 'ACTIVO',
    };


  }

  ngOnInit(): void {
    this.Api.getDocumentosHabilitantes().subscribe(data => {
      this.documentosHabilitante = data;
    })


  }
  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
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
    documentosHabilitantes={...documentosHabilitantes, estado:'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.crearDocumentosHabilitantes(documentosHabilitantes).subscribe({
        next: (response: HttpResponse<DocumentosHabilitantes>) => {
          let nuevadocumentosHabilitantes: DocumentosHabilitantes = response.body;
          this.documentosHabilitante.push(nuevadocumentosHabilitantes);
          this.notificacionOK('Documento Habilitante creada con éxito');
          this.documentohabilitantes = {
            codDocumentoHabilitante: 0,
            nombre: '',
            estado: 'ACTIVO',
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
        },
      })
    );
  }
  editRow(index: number) {
    this.editElementIndex = index;
    this.documentoHabilitanteEditForm = {...this.documentosHabilitante[index]};
  }

  undoRow() {
    this.documentoHabilitanteEditForm = {
      codDocumentoHabilitante: 0,
      nombre: '',
      estado: 'ACTIVO',
    };
    this.editElementIndex = -1;
  }


  //actualizar
  public actualizar(documentoHabilitantes: DocumentosHabilitantes, formValue): void {
    documentoHabilitantes={...documentoHabilitantes,  nombre: formValue.nombre, estado:'ACTIVO'};
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.actualizarDocumentosHabilitantes(documentoHabilitantes, documentoHabilitantes.codDocumentoHabilitante).subscribe({
      next: (response) => {
        this.notificacionOK('Documento Habilitante actualizada con éxito');
        this.documentosHabilitante[this.editElementIndex] = response.body;
        this.showLoading = false;
        this.documentohabilitantes = {
          codDocumentoHabilitante: 0,
          nombre: '',
          estado: 'ACTIVO',
        }
        this.editElementIndex=-1;
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.notificacion(errorResponse);
        this.showLoading = false;
      },
    })
    );
  }

  //eliminar

public eliminar(codDocumentoHabilitante: number): void {
  this.showLoading = true;
  this.subscriptions.push(
    this.Api.eliminarDocumentosHabilitantes(codDocumentoHabilitante).subscribe({
      next: () => {
        this.notificacionOK('Documento Habilitante eliminada con éxito');
        this.showLoading = false;
        const index = this.documentosHabilitante.findIndex(documentohabilitantes => this.documentohabilitantes.codDocumentoHabilitante ===codDocumentoHabilitante);
        this.documentosHabilitante.splice(index, 1);
        this.documentosHabilitante = [...this.documentosHabilitante]
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
