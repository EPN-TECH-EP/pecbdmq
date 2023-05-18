import {Component, OnInit, ViewChild} from '@angular/core';
import {DocumentosService} from "../../../../servicios/formacion/documentos.service";
import {DocumentoFormacion} from "../../../../modelo/flujos/formacion/documento";
import {MdbTableDirective} from "mdb-angular-ui-kit/table";
import {Usuario} from "../../../../modelo/admin/usuario";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {MdbPopconfirmService} from "mdb-angular-ui-kit/popconfirm";
import {ComponenteBase} from "../../../../util/componente-base";
import {Notificacion} from "../../../../util/notificacion";
import {TipoAlerta} from "../../../../enum/tipo-alerta";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidacionUtil} from "../../../../util/validacion-util";

@Component({
  selector: 'app-gestion-documentos',
  templateUrl: './gestion-documentos.component.html',
  styleUrls: ['./gestion-documentos.component.scss']
})
export class GestionDocumentosComponent extends ComponenteBase implements OnInit {

  documentos: DocumentoFormacion[]
  documentoForm: FormGroup;

  @ViewChild('table') table!: MdbTableDirective<Usuario>;
  addRow = false;
  headers = [
    {key: 'nombre', label: 'Nombre'},
    {key: 'descripcion', label: 'Descripción'},
    {key: 'observaciones', label: 'Observaciones'},
  ]

  estaEditando: boolean;
  codigoDocumentoEditando: number;

  constructor(
    private documentosService: DocumentosService,
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private formBuilder: FormBuilder
  ) {
    super(notificationServiceLocal, popConfirmServiceLocal);
    this.documentoForm = new FormGroup({});
    this.documentos = [];
    this.estaEditando = false;
    this.codigoDocumentoEditando = 0;
  }

  ngOnInit(): void {
    this.documentosService.getDocumentos().subscribe((documentos) => {
      console.log(documentos);
      this.documentos = documentos;
    });
    this.construirFormulario();
  }

  private construirFormulario() {
    this.documentoForm = this.formBuilder.group({
      descripcion   : ['', [Validators.required, Validators.maxLength(100)]],
      observaciones : ['', [Validators.maxLength(100)]],
      archivo       : ['', [Validators.required,]],
    });
  }

  descargar(documento: DocumentoFormacion) {
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
          this.notificationRef = Notificacion.notificar(this.notificationServiceLocal, 'Error al descargar documento', TipoAlerta.ALERTA_ERROR)
        }
      });
  }

  cargar() {
  }

  actualizar(documento: DocumentoFormacion) {
  }

  eliminar() {
  }

  editRow(documento: DocumentoFormacion) {
    this.documentoForm.patchValue({
      descripcion: documento.descripcion,
      observaciones: documento.observaciones,
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
