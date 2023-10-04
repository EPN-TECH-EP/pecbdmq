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
import { OPCIONES_DATEPICKER } from "../../../../util/constantes/opciones-datepicker.const";

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

  protected readonly CURSO_COMPLETO_ESTADO = CURSO_COMPLETO_ESTADO;
  addRowEstudiante: boolean;
  headersRepo = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
  ]

  documentoFormRepo: FormGroup;
  esTarea: boolean = false;

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
    this.addRowEstudiante = false;
    this.documentoFormRepo = new FormGroup({});
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

    this.documentoFormRepo = this.formBuilder.group({
      descripcion: ['', Validators.required],
      archivo: ['', Validators.required],
      esTarea: [false]
    });

    this.documentoFormRepo.controls['esTarea'].valueChanges.subscribe(value => {
      if (value) {
        this.documentoFormRepo.addControl('fechaEntrega', this.formBuilder.control('', Validators.required));
        this.esTarea = value;
        this.documentoFormRepo.controls['fechaEntrega'].valueChanges.subscribe(value => {
          const dia = value.getDate();
          const mes = value.getMonth() + 1;
          const anio = value.getFullYear();
          const fecha = `${ dia < 10 ? '0' + dia : dia }/${ mes < 10 ? '0' + mes : mes }/${ anio }`;

          this.documentoFormRepo.controls['descripcion'].setValue(`Tarea para el ${ fecha }`);
        });
      }
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

  private listarDocumentosRepo(codCurso) {
    this.cursosService.litarDocumentosRepo(codCurso).subscribe({
      next: (documentos) => {
        this.documentosRepo = documentos
        console.log('documentos repo',this.documentosRepo);
      }
    })
  }

  cursoSeleccionadoEvent($event: Curso) {
    if ($event) {
      console.log($event);
      this.cursoSeleccionado = $event;
      this.esVistaListaCursos = false;
      this.esVistaValidacionCurso = true;
      this.listarDocumentosCurso();
      this.listarDocumentosRepo(this.cursoSeleccionado.codCursoEspecializacion);
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


  protected readonly OPCIONES_DATEPICKER = OPCIONES_DATEPICKER;
  documentosRepo: any;

  cargarArchivoRepo(event: any) {
    this.archivo = event.target.files[0];
  }

  guardarArchivo() {

    if (this.documentoForm.invalid) {
      this.documentoForm.markAllAsTouched();
    }

    const formData = new FormData();

    formData.append('archivos', this.archivo);
    formData.append('codCursoEspecializacion', this.cursoSeleccionado.codCursoEspecializacion.toString());
    formData.append('esTarea', this.esTarea.toString());
    formData.append('descripcion', this.documentoFormRepo.controls['descripcion'].value);

    // Convertir FormData en un objeto JavaScript regular
    const formObject = {};
    formData.forEach((valor, clave) => {
      formObject[clave] = valor;
    });

    // los imprimo en un mismo objeto
    const objeto = {
      ...formObject,
    }

    console.log(objeto);
    this.cursosService.guardarDocumentoRepo(formData).subscribe({
      next: () => {
        Notificacion.notificar(this.ns, 'Documento cargado correctamente', TipoAlerta.ALERTA_OK);
        this.addRowEstudiante = false;
        this.listarDocumentosRepo(this.cursoSeleccionado.codCursoEspecializacion);
      }
    });
  }


  descargarArchivoRepo(documento: any) {
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

  eliminarRepo(documento: any) {
    this.cursosService.eliminarDocumentoRepo(documento.codDocumento, this.cursoSeleccionado.codCursoEspecializacion).subscribe({
      next: () => {
        let index = this.documentosRepo.findIndex((documento) => documento.codDocumento == documento.codDocumento);
        this.documentosRepo.splice(index, 1);
        this.documentosRepo = [...this.documentosRepo];
        Notificacion.notificar(this.ns, 'Documento eliminado correctamente', TipoAlerta.ALERTA_OK);
      }
    });
  }
}
