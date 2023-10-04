import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CursosService } from "../../../../servicios/especializacion/cursos.service";
import { NotaEspecializacion } from "../../../../modelo/flujos/especializacion/nota-especializacion";
import { Router } from "@angular/router";
import { DocumentosService } from "../../../../servicios/formacion/documentos.service";
import { Curso } from "../../../../modelo/flujos/especializacion/Curso";
import { catchError, tap } from "rxjs/operators";
import { Notificacion } from "../../../../util/notificacion";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { throwError } from "rxjs";
import { EstudianteService } from "../../../../servicios/formacion/estudiante.service";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import {
  EstudianteMateriaDocumentoItemDto
} from "../../repositorio-materia-estudiante/repositorio-materia-estudiante.component";

@Component({
  selector: 'app-eps-repo-estudiante',
  templateUrl: './eps-repo-estudiante.component.html',
  styleUrls: ['./eps-repo-estudiante.component.scss']
})
export class EpsRepoEstudianteComponent implements OnInit {
  headers: {key: string, label: string}[];
  addRow: boolean;
  estaEditando: boolean;
  documentoForm: FormGroup;
  documentos: any;
  estudiante: NotaEspecializacion;
  curso: Curso;
  archivo: File = null;

  constructor(
    private ns: MdbNotificationService,
    private estudianteService: EstudianteService,
    private cursosService: CursosService,
    private router: Router,
    private documentosService: DocumentosService,
    private builder: FormBuilder) {

    this.addRow = false;
    this.estaEditando = false;
    this.headers = [
      { key: 'nombre', label: 'Nombre' },
      { key: 'descripcion', label: 'Descripción' },
    ]
    this.documentoForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.estudiante = this.cursosService.estudiante;
    this.curso = this.cursosService.curso;
    if (this.estudiante === null) {
      this.router.navigate(['/principal/especializacion/academia/notas']);
      return;
    }
    this.listarDocumentos();
    this.construirFormulario();
  }

  private listarDocumentos() {
    this.documentosService.listarDocumentosEsp(this.estudiante.codEstudiante, this.curso.codCursoEspecializacion).subscribe({
      next: (documentos) => {
        this.documentos = documentos;
        console.log(this.documentos);
      }
    });
  }

  private construirFormulario() {
    this.documentoForm = this.builder.group({
      descripcion: ['', Validators.required],
      archivo: ['', Validators.required],

    });
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
      codCursoEspecializacion: this.curso.codCursoEspecializacion,
      descripcion: this.documentoForm.get('descripcion')?.value
    }
    formData.append('docs', this.archivo);
    formData.append('datosEstudianteMateriaDocumento', JSON.stringify(data));

    this.estudianteService.guardarDocumentoCursoEstudiante(formData).pipe(
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

  eliminar(codDocumento: number) {

    this.estudianteService.eliminarDocumentoEsp(codDocumento).subscribe({
      next: () => {
        Notificacion.notificar(this.ns, 'Documento eliminado correctamente', TipoAlerta.ALERTA_OK);
        this.listarDocumentos();
      }
    })

  }
}
