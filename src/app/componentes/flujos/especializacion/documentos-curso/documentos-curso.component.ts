import { Component, OnInit } from '@angular/core';
import { Curso } from "../../../../modelo/flujos/especializacion/Curso";
import { CURSO_COMPLETO_ESTADO } from "../../../../util/constantes/especializacion.const";
import { CursosService } from "../../../../servicios/especializacion/cursos.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DocumentoFormacion } from "../../../../modelo/flujos/formacion/documento";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { DocumentosCursoService } from "../../../../servicios/especializacion/documentos-curso.service";
import { Notificacion } from "../../../../util/notificacion";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { ActivatedRoute, Router } from "@angular/router";

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
  codigoDocumentoEditando: number;

  estado: string;

  constructor(
    private cursosService: CursosService,
    private formBuilder: FormBuilder,
    private ns: MdbNotificationService,
    private documentosCursoService: DocumentosCursoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.esVistaListaCursos = true;
    this.estaCargando = true;
    this.esVistaValidacionCurso = false;
    this.cursos = [];
    this.cursoSeleccionado = null;
    this.documentoForm = new FormGroup({});
    this.documentos = [];
    this.addRow = false;
    this.codigoDocumentoEditando = 0;
    this.archivo = new File([], '');
    this.estado = '';
    this.construirFormulario();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {

      const estado = params['estado'];

      if (estado && estado === CURSO_COMPLETO_ESTADO.ABIERTOS.toLowerCase()) {
        this.listarCursosPorEstado(CURSO_COMPLETO_ESTADO.ABIERTOS);
        this.estado = CURSO_COMPLETO_ESTADO.ABIERTOS;
        return;
      }

      if (estado && estado === CURSO_COMPLETO_ESTADO.TODOS.toLowerCase()) {
        this.listarCursosPorEstado(CURSO_COMPLETO_ESTADO.TODOS);
        this.estado = CURSO_COMPLETO_ESTADO.TODOS;
        return;
      }

      this.router.navigate(['/principal/especializacion/menu-convocatoria']).then();

    });
  }

  private listarCursosPorEstado(estado: string) {
    this.cursosService.listarCursosPorEstado(estado).subscribe({
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
      console.log($event);
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

    if (this.estado === CURSO_COMPLETO_ESTADO.TODOS) return;

    const formData = new FormData();
    formData.append('archivos', this.archivo);
    formData.append('codCursoEspecializacion', this.cursoSeleccionado.codCursoEspecializacion.toString());

    this.documentosCursoService.cargar(formData).subscribe({
      next: () => {
        Notificacion.notificar(this.ns, 'Documento cargado correctamente', TipoAlerta.ALERTA_OK);
        this.addRow = false;
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


  eliminar(codDocumento: number) {

    console.log('Eliminando documento', codDocumento, this.cursoSeleccionado.codCursoEspecializacion);
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

  protected readonly CURSO_COMPLETO_ESTADO = CURSO_COMPLETO_ESTADO;
}
