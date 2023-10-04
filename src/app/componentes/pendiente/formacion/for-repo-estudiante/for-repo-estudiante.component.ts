import { Component, OnInit } from '@angular/core';
import { MateriaPorInstructor, RegistroNotasService } from "../../../../servicios/formacion/registro-notas.service";
import { NotaPorEstudiante } from "../../../../modelo/flujos/Estudiante";
import { Router } from "@angular/router";
import {
  EstudianteCursoDocumentoItemDto
} from "../../repositorio-materia-estudiante/repositorio-materia-estudiante.component";
import { DocumentosService } from "../../../../servicios/formacion/documentos.service";
import { Paralelo } from "../../../../modelo/admin/paralelo";

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
    private documentosService: DocumentosService,) {
    this.estudiante = null;
  }

  ngOnInit(): void {
    this.estudiante = this.registroNotasService.estudiante;
    this.materia = this.registroNotasService.materia;
    this.estudiantesPorParalelo = this.registroNotasService.estudiantesPorParalelo;

    if (this.estudiante === null || this.materia === null || this.estudiantesPorParalelo === null) {
      this.router.navigate(['/principal/formacion/academia/materias']);
      return;
    }
  }

  private listarDocumentos() {
    // this.documentosService.listarDocumentosFor().subscribe({
    //   next: (documentos) => {
    //     this.documentos = documentos;
    //     console.log(this.documentos);
    //   }
    // });
  }

  descargarArchivo(documento: EstudianteCursoDocumentoItemDto) {
    
  }
}
