import { Component, OnInit } from '@angular/core';
import { FormacionHistoricoService } from "../../../servicios/consultaHistoricas/formacion-historico.service";
import {
  EstudianteService,
  NotaMateriaPorEstudiante,
  NotasFormacion
} from "../../../servicios/formacion/estudiante.service";
import { Estudiante } from "../../../modelo/flujos/Estudiante";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DocumentoFormacion } from "../../../modelo/flujos/formacion/documento";
import { catchError, tap } from "rxjs/operators";
import { Notificacion } from "../../../util/notificacion";
import { TipoAlerta } from "../../../enum/tipo-alerta";
import { throwError } from "rxjs";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { DocumentosService } from "../../../servicios/formacion/documentos.service";
import { Router } from "@angular/router";

export interface EstudianteMateriaDocumentoDto {
  codMateriaParalelo: number;
  codEstudiante: number;
  estado: string;
  descripcion: string;

}

export interface EstudianteMateriaDocumentoItemDto {

  codEstudianteMateriaDocumento: number;
  codDocumento: number;
  codEstudianteMateriaParalelo: number;
  estado: string;
  descripcion: string;
  nombre?: string;

}

@Component({
  selector: 'app-repositorio-materia-estudiante',
  templateUrl: './repositorio-materia-estudiante.component.html',
  styleUrls: ['./repositorio-materia-estudiante.component.scss']
})
export class RepositorioMateriaEstudianteComponent implements OnInit {

  nota: NotaMateriaPorEstudiante
  estudiante: Estudiante

  // documetos
  addRow: boolean;
  archivo: File = null;
  estaEditando: boolean = false;
  documentoForm: FormGroup = new FormGroup({});
  documentos: EstudianteMateriaDocumentoItemDto[]
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


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private documentosService: DocumentosService,
    private ns: MdbNotificationService,
    private formacionHistoricoService: FormacionHistoricoService, private estudianteService: EstudianteService,) {
    this.nota = null
    this.estudiante = null
    this.documentos = []
    this.addRow = false;
    this.archivo = new File([], '');
    this.codigoDocumentoEditando = 0;
    this.estaEditando = false;
    this.documentoForm = new FormGroup({});
    this.construirFormulario()
    this.construirFormulariosEncuesta()
  }


  ngOnInit(): void {
    this.nota = this.formacionHistoricoService.nota
    this.estudiante = this.estudianteService.estudiante

    if (this.nota === null && this.estudiante === null) {
      this.router.navigate(['/principal/fichaPersonal']).then()
      return
    }

    this.listarDocumentos()


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

  private listarDocumentos() {
    this.estudianteService.listarDocumentosPorMateriaYEstudiante(this.estudiante.codEstudiante, this.nota.codMateriaCurso).subscribe({
      next: (documentos) => {
        this.documentos = documentos
      },
      error: (error) => {
        console.log('Error al listar documentos', error);
        Notificacion.notificar(this.ns, 'Error al listar documentos', TipoAlerta.ALERTA_ERROR);
      }
    })
  }

  cargarArchivo(event: any) {
    this.archivo = event.target.files[0];
  }

  guardarArchivo() {
    if (this.documentoForm.invalid) {
      this.documentoForm.markAllAsTouched();
    }


    const formData = new FormData();

    const data: EstudianteMateriaDocumentoDto = {
      codMateriaParalelo: this.nota.codMateriaCurso,
      codEstudiante: this.estudiante.codEstudiante,
      estado: 'ACTIVO',
      descripcion: this.documentoForm.get('descripcion')?.value
    }
    formData.append('docs', this.archivo);
    formData.append('datosEstudianteMateriaDocumento', JSON.stringify(data));

    this.estudianteService.guardarDocumentoMateriaEstudiante(formData).pipe(
      tap(() => {
        Notificacion.notificar(this.ns, 'Documento creado correctamente', TipoAlerta.ALERTA_OK);
        this.listarDocumentos();
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

  descargarArchivo(documento: EstudianteMateriaDocumentoItemDto) {
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

    this.estudianteService.eliminarDocumento(codDocumento).subscribe({
      next: () => {
        Notificacion.notificar(this.ns, 'Documento eliminado correctamente', TipoAlerta.ALERTA_OK);
        this.listarDocumentos();
      }
    })

  }

  actualizar(documento: DocumentoFormacion) {

  }

  undoRow() {

  }

  guardarEncuesta() {

    if (this.listaPreguntasFormulario.some((pregunta) => pregunta.invalid)) {
      Notificacion.notificar(this.ns, 'Debe responder todas las preguntas', TipoAlerta.ALERTA_ERROR);
      this.listaPreguntasFormulario.forEach((pregunta) => pregunta.markAllAsTouched());
    }

    Notificacion.notificar(this.ns, 'Encuesta guardada correctamente', TipoAlerta.ALERTA_OK);

    this.esEncuestaFinalizada = true;

  }
}
