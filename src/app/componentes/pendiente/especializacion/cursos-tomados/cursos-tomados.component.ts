import { Component, OnInit } from '@angular/core';
import {
  CursoTomado,
  EstudianteService,
  NotaMateriaPorEstudiante
} from "../../../../servicios/formacion/estudiante.service";
import { Estudiante } from "../../../../modelo/flujos/Estudiante";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Documento } from "../../../../servicios/periodo-academico.service";
import {
  EstudianteCursoDocumentoItemDto, EstudianteMateriaDocumentoDto,
  EstudianteMateriaDocumentoItemDto
} from "../../repositorio-materia-estudiante/repositorio-materia-estudiante.component";
import { catchError, tap } from "rxjs/operators";
import { Notificacion } from "../../../../util/notificacion";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { throwError } from "rxjs";
import { DocumentoFormacion } from "../../../../modelo/flujos/formacion/documento";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { DocumentosService } from "../../../../servicios/formacion/documentos.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-cursos-tomados',
  templateUrl: './cursos-tomados.component.html',
  styleUrls: ['./cursos-tomados.component.scss']
})
export class CursosTomadosComponent implements OnInit {

  estudiante: Estudiante;
  cursosTomados: CursoTomado[];
  esVistaCursosTomados: boolean = true;
  esVistaCursoSeleccionado: boolean = false;
  cursoSeleccionado: CursoTomado;
  nota: NotaMateriaPorEstudiante

  // documetos
  addRow: boolean;
  archivo: File = null;
  estaEditando: boolean = false;
  documentoForm: FormGroup = new FormGroup({});
  documentos: EstudianteCursoDocumentoItemDto[]
  codigoDocumentoEditando: number = 0;
  headers = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
  ]

  // encuesta
  listaPreguntasFormulario: FormGroup[] = [];
  preguntas: string[] = [
    '¿El docente es puntual?',
    '¿El docente es claro en sus explicaciones?',
    '¿El docente es respetuoso?',
    '¿El docente es justo?',
    '¿El docente es imparcial?',
    '¿El docente es objetivo?',
    '¿El docente es responsable?',
    '¿El docente es honesto?',
    '¿El docente es amable?',
    '¿El contenido de la materia es claro y pertinente?',
    '¿El docente cumple con el programa de la materia?',
    '¿El docente cumple con el horario de la materia?',
    '¿El docente cumple con el plan de evaluación?',
    '¿El docente cumple con el plan de trabajo?',
    '¿El docente cumple con el plan de actividades?',
  ];
  esEncuestaFinalizada: boolean = false;

  constructor(private estudianteService: EstudianteService,
              private router: Router,
              private ns: MdbNotificationService,
              private documentosService: DocumentosService,
              private formBuilder: FormBuilder,
              private httpClient: HttpClient) {
    this.estudiante = null;
    this.construirFormulario()
    this.construirFormulariosEncuesta()
  }

  ngOnInit(): void {
    this.estudiante = this.estudianteService.estudiante;

    if (this.estudiante == null) {
      this.router.navigate(['/principal/fichaPersonal']).then();
      return;
    }

    this.cargarCursoTomados();


  }

  private construirFormulario() {
    this.documentoForm = this.formBuilder.group({
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      archivo: ['', [Validators.required,]],
    });
  }

  private construirFormulariosEncuesta() {
    this.preguntas.forEach((pregunta, index) => {
      this.listaPreguntasFormulario.push(this.formBuilder.group({
        pregunta: [pregunta, [Validators.required]],
        estado: ['', [Validators.required]],
      }));
    });
  }


  private cargarCursoTomados() {
    this.estudianteService.obtenerCursosTomados(this.estudiante.codEstudiante).subscribe({
      next: (cursosTomados) => {
        this.cursosTomados = cursosTomados;
        console.log(this.cursosTomados);
      }
    })
  }

  private cargarNotasPorCurso() {
    this.estudianteService.obtenerNotasPorCurso(this.estudiante.codEstudiante, this.cursoSeleccionado.codCursoEspecializacion).subscribe({
      next: (notasPorCurso) => {
        this.nota = notasPorCurso[0];
        console.log('nota por curso', notasPorCurso)
      }
    })
  }

  private listarDocumentosEsp() {
    this.documentosService.listarDocumentosEsp(this.estudiante.codEstudiante, this.cursoSeleccionado.codCursoEspecializacion).subscribe({
      next: (documentos) => {
        this.documentos = documentos;
        console.log(this.documentos);
      }
    })
  }

  verCursoSeleccionado(curso: CursoTomado) {
    this.cursoSeleccionado = curso;
    this.cargarNotasPorCurso();
    this.esVistaCursosTomados = false;
    this.esVistaCursoSeleccionado = true;
    this.listarDocumentosEsp();
  }

  volverVistaCursosTomados() {
    this.cursoSeleccionado = null;
    this.esVistaCursosTomados = true;
    this.esVistaCursoSeleccionado = false;
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
      codEstudiante: this.estudiante.codEstudiante,
      codCursoEspecializacion: this.cursoSeleccionado.codCursoEspecializacion,
      descripcion: this.documentoForm.get('descripcion')?.value
    }
    formData.append('docs', this.archivo);
    formData.append('datosEstudianteMateriaDocumento', JSON.stringify(data));

    this.estudianteService.guardarDocumentoCursoEstudiante(formData).pipe(
      tap(() => {
        Notificacion.notificar(this.ns, 'Documento creado correctamente', TipoAlerta.ALERTA_OK);
        this.listarDocumentosEsp();
        this.addRow = false;
      }),
      catchError((error) => {
        console.log('Error al crear documento', error);
        Notificacion.notificar(this.ns, 'Error al crear documento', TipoAlerta.ALERTA_ERROR);
        this.addRow = false;
        return throwError(error);
      })
    ).subscribe();
  }

  descargarArchivoEsp(documento: EstudianteMateriaDocumentoItemDto) {
    this.documentosService.descargar(documento.codDocumento).subscribe(
      {
        next: (data) => {
          const blob = new Blob([data]/*, {type: 'application/pdf'}*/);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          const nombreDocumento = blob.type.split('/')[1];
          link.href = url;
          link.download = `${ nombreDocumento || 'Documento' }.pdf`;
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

  }

  eliminar(codDocumento: number) {

    this.estudianteService.eliminarDocumentoEsp(codDocumento).subscribe({
      next: () => {
        Notificacion.notificar(this.ns, 'Documento eliminado correctamente', TipoAlerta.ALERTA_OK);
        this.listarDocumentosEsp();
      }
    })

  }

  onGuardarEncuesta() {

    if (this.listaPreguntasFormulario.some((pregunta) => pregunta.invalid)) {
      Notificacion.notificar(this.ns, 'Debe responder todas las preguntas', TipoAlerta.ALERTA_ERROR);
      this.listaPreguntasFormulario.forEach((pregunta) => pregunta.markAllAsTouched());
    }

    Notificacion.notificar(this.ns, 'Encuesta guardada correctamente', TipoAlerta.ALERTA_OK);

    this.esEncuestaFinalizada = true;

  }

  descargarCertificado(): void {
    const archivoUrl = 'assets/docs/certificado-esp.pdf'; // Ruta relativa al archivo en la carpeta 'assets'

    // Realizar una solicitud GET para obtener el archivo
    this.httpClient.get(archivoUrl, { responseType: 'blob' }).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);

      // Crear un enlace de descarga seguro
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificado.pdf'; // Nombre del archivo para descargar
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }

}
