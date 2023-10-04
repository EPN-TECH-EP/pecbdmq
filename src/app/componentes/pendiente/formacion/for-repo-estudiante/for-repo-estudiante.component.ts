import { Component, OnInit } from '@angular/core';
import { MateriaPorInstructor, RegistroNotasService } from "../../../../servicios/formacion/registro-notas.service";
import { NotaPorEstudiante } from "../../../../modelo/flujos/Estudiante";
import { Router } from "@angular/router";
import {
  EstudianteCursoDocumentoItemDto, EstudianteMateriaDocumentoItemDto
} from "../../repositorio-materia-estudiante/repositorio-materia-estudiante.component";
import { DocumentosService } from "../../../../servicios/formacion/documentos.service";
import { Paralelo } from "../../../../modelo/admin/paralelo";
import { Notificacion } from "../../../../util/notificacion";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { EstudianteService } from "../../../../servicios/formacion/estudiante.service";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";

@Component({
  selector: 'app-for-repo-estudiante',
  templateUrl: './for-repo-estudiante.component.html',
  styleUrls: ['./for-repo-estudiante.component.scss']
})
export class ForRepoEstudianteComponent implements OnInit {

  estudiante: NotaPorEstudiante
  documentos: EstudianteCursoDocumentoItemDto[]
  materia: MateriaPorInstructor;
  estudiantesPorParalelo: {paralelo: Paralelo; estudiantes: NotaPorEstudiante[]}[];

  headers = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
  ]

  constructor(
    private registroNotasService: RegistroNotasService,
    private router: Router,
    private documentosService: DocumentosService,
    private estudianteService: EstudianteService,
    private ns: MdbNotificationService
  ) {
    this.estudiante = null;
  }

  ngOnInit(): void {
    this.estudiante = this.registroNotasService.estudiante;
    this.materia = this.registroNotasService.materia;
    this.estudiantesPorParalelo = this.registroNotasService.estudiantesPorParalelo;

    if (this.estudiante === null || this.materia === null || this.estudiantesPorParalelo === null) {
      this.router.navigate(['/principal/formacion/menu-academia']);
      return;
    }
    this.listarDocumentos();
  }

  private listarDocumentos() {
    this.estudianteService.listarDocumentosPorMateriaYEstudiante(this.estudiante.codEstudiante, this.materia.codMateriaParalelo).subscribe({
      next: (documentos) => {
        console.log('codMateria', this.materia.codMateria);
        console.log('codEstudiante', 108);
        this.documentos = documentos
        console.log('Documentos', documentos);
      },
      error: (error) => {
        console.log('Error al listar documentos', error);
        Notificacion.notificar(this.ns, 'Error al listar documentos', TipoAlerta.ALERTA_ERROR);
      }
    })
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

}
