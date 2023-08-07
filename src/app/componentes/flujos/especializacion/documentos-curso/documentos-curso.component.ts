import { Component, OnInit } from '@angular/core';
import { Curso } from "../../../../modelo/flujos/especializacion/Curso";
import { CURSO_COMPLETO_ESTADO } from "../../../../util/constantes/especializacon.const";
import { CursosService } from "../../../../servicios/especializacion/cursos.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DocumentoFormacion } from "../../../../modelo/flujos/formacion/documento";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { DocumentosCursoService } from "../../../../servicios/especializacion/documentos-curso.service";
import { Notificacion } from "../../../../util/notificacion";
import { TipoAlerta } from "../../../../enum/tipo-alerta";

@Component({
  selector: 'app-documentos-curso',
  templateUrl: './documentos-curso.component.html',
  styleUrls: ['./documentos-curso.component.scss']
})
export class DocumentosCursoComponent implements OnInit {
  esVistaListaCursos: boolean;
  estaCargando: boolean;
  esVistaValidacionCurso: boolean;
  cursos: Curso[];
  archivo: File;
  cursoSeleccionado: Curso;
  documentoForm: FormGroup;
  documentos: DocumentoFormacion[];
  headers = [
    { key: 'nombre', label: 'Nombre' },
  ]
  addRow: boolean;
  estaEditando: boolean;
  codigoDocumentoEditando: number;

  constructor(
    private cursosService: CursosService,
    private formBuilder: FormBuilder,
    private ns: MdbNotificationService,
    private documentosCursoService: DocumentosCursoService
  ) {
    this.esVistaListaCursos = true;
    this.estaCargando = true;
    this.esVistaValidacionCurso = false;
    this.cursos = [];
    this.cursoSeleccionado = null;
    this.documentoForm = new FormGroup({});
    this.documentos = [];
    this.addRow = false;
    this.estaEditando = false;
    this.codigoDocumentoEditando = 0;
    this.archivo = new File([], '');
    this.construirFormulario();
  }

  ngOnInit(): void {
    this.cursosService.listarCursosPorEstado(CURSO_COMPLETO_ESTADO.TODOS).subscribe({
      next: (cursos) => {
        this.cursos = cursos
        this.estaCargando = false;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  private construirFormulario() {
    this.documentoForm = this.formBuilder.group({
      descripcion: [''],
      observaciones: [''],
      archivo: ['', [Validators.required,]],
    });
  }

  private listarDocumentosCurso() {
    this.cursosService.getTipoCurso(this.cursoSeleccionado.codCatalogoCursos).subscribe({
      next: (tipoCurso) => {
        this.cursoSeleccionado.tipoCurso = tipoCurso;
      }
    });
    this.documentosCursoService.listarPorCurso(this.cursoSeleccionado.codCursoEspecializacion).subscribe({
      next: (documentos) => {
        this.documentos = documentos as DocumentoFormacion[];
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  cursoSeleccionadoEvent($event: Curso) {
    if ($event) {
      this.cursoSeleccionado = $event;
      this.esVistaListaCursos = false;
      this.esVistaValidacionCurso = true;
      this.listarDocumentosCurso();
    }
  }

  volverAListaCursos() {
    this.esVistaListaCursos = true;
    this.esVistaValidacionCurso = false;
    this.cursoSeleccionado = null;
  }

  cargarArchivo(event: any) {
    this.archivo = event.target.files[0];
  }

  cargar() {

    if (this.documentoForm.invalid) return;

    const formData = new FormData();
    // formData.append('descripcion', this.documentoForm.get('descripcion')?.value);
    // formData.append('observaciones', this.documentoForm.get('observaciones')?.value);
    formData.append('archivos', this.archivo);
    formData.append('codCursoEspecializacion', this.cursoSeleccionado.codCursoEspecializacion.toString());

    this.documentosCursoService.cargar(formData).subscribe({
      next: (documento) => {
        Notificacion.notificar(this.ns, 'Documento cargado correctamente', TipoAlerta.ALERTA_OK);
        this.documentosCursoService.listarPorCurso(this.cursoSeleccionado.codCursoEspecializacion).subscribe({
          next: (documentos) => {
            this.documentos = documentos as DocumentoFormacion[];
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
    });

  }

  descargarArchivo(documento: DocumentoFormacion) {
    this.documentosCursoService.descargar(documento.codDocumento).subscribe(
      {
        next: (data) => {
          const blob = new Blob([data]);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${ documento.nombre }`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.log('Error al descargar documento', error);
          Notificacion.notificar(this.ns, 'Error al descargar documento', TipoAlerta.ALERTA_ERROR)
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
    this.codigoDocumentoEditando = documento.codDocumento;
  }

  eliminar(codDocumento: number) {

    this.documentosCursoService.eliminar(codDocumento, this.cursoSeleccionado.codCursoEspecializacion).subscribe({
      next: () => {
        let index = this.documentos.findIndex((documento) => documento.codDocumento == codDocumento);
        this.documentos.splice(index, 1);
        this.documentos = [...this.documentos];
        Notificacion.notificar(this.ns, 'Documento eliminado correctamente', TipoAlerta.ALERTA_OK);
      },
      error: (error) => {
        console.log('Error al eliminar documento', error);
        Notificacion.notificar(this.ns, 'Error al eliminar documento', TipoAlerta.ALERTA_ERROR);
      }
    });
  }

  actualizar(documento: DocumentoFormacion) {
    const formData = new FormData();
    formData.append('archivo', this.archivo);
    formData.append('descripcion', this.documentoForm.get('descripcion')?.value);
    formData.append('observacion', this.documentoForm.get('observaciones')?.value);
    formData.append('tipo', '61');

    this.documentosCursoService.actualizar(formData, documento.codDocumento).subscribe({
      next: (documento) => {
        let index = this.documentos.findIndex((documento) => documento.codDocumento == this.codigoDocumentoEditando);
        this.documentos[index] = <DocumentoFormacion>documento;
        this.documentos = [...this.documentos]
        Notificacion.notificar(this.ns, 'Documento actualizado correctamente', TipoAlerta.ALERTA_OK);
        this.documentoForm.reset();
        this.estaEditando = false;
      },
      error: (error) => {
        console.log('Error al actualizar documento', error);
        Notificacion.notificar(this.ns, 'Error al actualizar documento', TipoAlerta.ALERTA_ERROR);
      }
    });
  }

  undoRow() {
    this.documentoForm.reset();
    this.estaEditando = false;
    this.codigoDocumentoEditando = 0;
  }
}
