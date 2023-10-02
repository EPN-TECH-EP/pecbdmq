import {Component, OnInit} from '@angular/core';
import {MdbModalRef} from "mdb-angular-ui-kit/modal";
import {Funcionario, FuncionarioService} from "../../services/funcionario.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {TipoAlerta} from "../../../../../enum/tipo-alerta";
import {Notificacion} from "../../../../../util/notificacion";
import {DocumentosService} from "../../../../../servicios/formacion/documentos.service";

@Component({
  selector: 'app-modal-carga-reconocimiento',
  templateUrl: './modal-carga-reconocimiento.component.html',
  styleUrls: ['./modal-carga-reconocimiento.component.scss']
})
export class ModalCargaReconocimientoComponent implements OnInit {

  documentos: any[];
  archivo: File | null = null;
  funcionario: Funcionario
  addRow: boolean = false;
  documentoForm: FormGroup;
  headers: { label: string; key: string; }[]

  constructor(
    public modalRef: MdbModalRef<ModalCargaReconocimientoComponent>,
    private formBuilder: FormBuilder,
    private funcionariosService: FuncionarioService,
    private ns: MdbNotificationService,
    private documentosService: DocumentosService) {
    this.funcionario = null;
    this.documentoForm = new FormGroup({});

    this.construirFormulario();
  }

  ngOnInit(): void {
    this.listarDocumentosReconocimiento(this.funcionario.codFuncionario);

  }

  private listarDocumentosReconocimiento(codFuncionario: number) {
    this.funcionariosService.listarDocumentosReconocimiento(this.funcionario.codFuncionario).subscribe({
      next: documentos => {
        this.documentos = documentos;
        //filtramos solo los reconocimientos
        this.documentos = this.documentos.filter(documento => documento.esReconocimiento === true);
        console.log(this.documentos);
      }
    })
  }

  private construirFormulario() {
    this.documentoForm = this.formBuilder.group({
      documento: ['', Validators.required],
      observacion: ['', Validators.required],
    });
  }

  private mostrarNotificacion(mensaje: string, tipo: TipoAlerta) {
    Notificacion.notificar(this.ns, mensaje, tipo);
  }


  cargarArchivo(event: any) {
    this.archivo = event.target.files[0];
  }

  guardarArchivo() {
    if (this.documentoForm.invalid) {
      this.documentoForm.markAllAsTouched();
    }

    const formData = new FormData();

    const data = {
      codFuncionario: this.funcionario.codFuncionario,
      esReconocimiento: true,
      observacion: this.documentoForm.get('observacion')?.value
    }

    formData.append('datosFuncionarioDocumento', JSON.stringify(data));
    formData.append('docs', this.archivo);

    this.funcionariosService.guardarDocumentoReconocimiento(formData).subscribe({
      next: response => {
        this.addRow = false;
        this.mostrarNotificacion('Documento guardado correctamente', TipoAlerta.ALERTA_OK)
        console.log(response);
        this.listarDocumentosReconocimiento(this.funcionario.codFuncionario);
      }
    })

  }

  descargarDocumento(codDocumentoFuncionario: number) {
    this.documentosService.descargar(codDocumentoFuncionario).subscribe(
      {
        next: (data) => {
          const blob = new Blob([data]/*, {type: 'application/pdf'}*/);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          const nombreDocumento = blob.type.split('/')[1];
          link.href = url;
          link.download = `${nombreDocumento || 'Documento'}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.log('Error al descargar documento', error);
          Notificacion.notificar(this.ns, 'Error al descargar documento', TipoAlerta.ALERTA_ERROR)
        }
      });
  }

  eliminarDocumento(codDocumentoFuncionario: any) {
    this.funcionariosService.eliminarDocumentoReconocimiento(codDocumentoFuncionario).subscribe({
      next: response => {
        this.mostrarNotificacion('Documento eliminado correctamente', TipoAlerta.ALERTA_OK)
        this.listarDocumentosReconocimiento(this.funcionario.codFuncionario);
      }
    });
  }
}
