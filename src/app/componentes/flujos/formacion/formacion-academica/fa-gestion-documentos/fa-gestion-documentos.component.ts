import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentoFormacion } from "../../../../../modelo/flujos/formacion/documento";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MdbTableDirective } from "mdb-angular-ui-kit/table";
import { Usuario } from "../../../../../modelo/admin/usuario";
import { DocumentosService } from "../../../../../servicios/formacion/documentos.service";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { MdbPopconfirmService } from "mdb-angular-ui-kit/popconfirm";
import { ConvocatoriaService } from "../../../../../servicios/formacion/convocatoria.service";
import { Convocatoria } from "../../../../../modelo/admin/convocatoria";
import { Notificacion } from "../../../../../util/notificacion";
import { TipoAlerta } from "../../../../../enum/tipo-alerta";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";
import { ComponenteBase } from "../../../../../util/componente-base";

@Component({
  selector: 'app-fa-gestion-documentos',
  templateUrl: './fa-gestion-documentos.component.html',
  styleUrls: ['./fa-gestion-documentos.component.scss']
})
export class FaGestionDocumentosComponent extends ComponenteBase implements OnInit {

  documentos: DocumentoFormacion[]
  documentoForm: FormGroup;
  archivo: File;

  @ViewChild('table') table!: MdbTableDirective<Usuario>;
  addRow = false;
  headers = [
    {key: 'nombre', label: 'Nombre'},
    {key: 'descripcion', label: 'Descripción'},
    {key: 'observaciones', label: 'Observaciones'},
  ]

  estaEditando: boolean;
  codigoDocumentoEditando: number;
  codigoConvocatoriaActiva: number;

  constructor(
    private documentosService: DocumentosService,
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private formBuilder: FormBuilder,
    private convocatoriaService: ConvocatoriaService,
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);
    this.documentoForm = new FormGroup({});
    this.documentos = [];
    this.estaEditando = false;
    this.codigoDocumentoEditando = 0;
    this.archivo = new File([], '');
    this.codigoConvocatoriaActiva = 0;
  }

  ngOnInit(): void {
    this.documentosService.listar().subscribe((documentos) => {
      console.log(documentos);
      this.documentos = documentos;
    });
    this.convocatoriaService.getConvocatoriaActiva().subscribe({
      next: (convocatorias: Convocatoria[]) => {
        this.codigoConvocatoriaActiva = convocatorias[0].codConvocatoria
      },
    })
    this.construirFormulario();
  }

  private construirFormulario() {
    this.documentoForm = this.formBuilder.group({
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      observaciones: ['', [Validators.maxLength(100)]],
      archivo: ['', [Validators.required,]],
    });
  }

  descargarArchivo(documento: DocumentoFormacion) {
    this.documentosService.descargar(documento.codigo).subscribe(
      {
        next: (data) => {
          const blob = new Blob([data], {type: 'application/pdf'});
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${documento.nombre}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.log('Error al descargar documento', error);
          Notificacion.notificar(this.notificationServiceLocal, 'Error al descargar documento', TipoAlerta.ALERTA_ERROR)
        }
      });
  }

  cargarArchivo(event: any) {
    this.archivo = event.target.files[0];
    console.log(this.archivo);

  }

  crear() {

    if (this.documentoForm.invalid) return;

    const formData = new FormData();
    formData.append('archivos', this.archivo);
    formData.append('descripcion', this.documentoForm.get('descripcion')?.value);
    formData.append('observacion', this.documentoForm.get('observaciones')?.value);

    this.documentosService.crear(formData).pipe(
      tap(() => {
        this.documentosService.listar().subscribe((documentos) => {
          this.documentos = documentos;
          Notificacion.notificar(this.notificationServiceLocal, 'Documento creado correctamente', TipoAlerta.ALERTA_OK);
          this.documentoForm.reset();
        });
        this.addRow = false;
      }),
      catchError((error) => {
        console.log('Error al crear documento', error);
        Notificacion.notificar(this.notificationServiceLocal, 'Error al crear documento', TipoAlerta.ALERTA_ERROR);
        this.addRow = false;
        return throwError(error);
      })
    ).subscribe();
  }

  actualizar(documento: DocumentoFormacion) {
    const formData = new FormData();
    formData.append('archivo', this.archivo);
    formData.append('descripcion', this.documentoForm.get('descripcion')?.value);
    formData.append('observacion', this.documentoForm.get('observaciones')?.value);
    formData.append('tipo', '61');

    this.documentosService.actualizar(formData, documento.codigo).subscribe({
      next: (documento) => {
        let index = this.documentos.findIndex((documento) => documento.codigo == this.codigoDocumentoEditando);
        this.documentos[index] = documento;
        this.documentos = [...this.documentos]
        Notificacion.notificar(this.notificationServiceLocal, 'Documento actualizado correctamente', TipoAlerta.ALERTA_OK);
        this.documentoForm.reset();
        this.estaEditando = false;
      },
      error: (error) => {
        console.log('Error al actualizar documento', error);
        Notificacion.notificar(this.notificationServiceLocal, 'Error al actualizar documento', TipoAlerta.ALERTA_ERROR);
      }
    });

  }

  eliminar(id: number) {
    console.log(this.codigoConvocatoriaActiva)
    console.log(id)

    this.documentosService.eliminar(id).subscribe({
      next: () => {
        let index = this.documentos.findIndex((documento) => documento.codigo == id);
        this.documentos.splice(index, 1);
        this.documentos = [...this.documentos];
        Notificacion.notificar(this.notificationServiceLocal, 'Documento eliminado correctamente', TipoAlerta.ALERTA_OK);
      },
      error: (error) => {
        console.log('Error al eliminar documento', error);
        Notificacion.notificar(this.notificationServiceLocal, 'Error al eliminar documento', TipoAlerta.ALERTA_ERROR);
      }
    });
  }

  editRow(documento: DocumentoFormacion) {
    this.documentoForm.patchValue({
      descripcion: documento.descripcion,
      observaciones: documento.observaciones,
      archivo: documento.nombre
    });
    this.estaEditando = true;
    this.codigoDocumentoEditando = documento.codigo;
  }

  undoRow() {
    this.documentoForm.reset();
    this.estaEditando = false;
    this.codigoDocumentoEditando = 0;
  }

}
