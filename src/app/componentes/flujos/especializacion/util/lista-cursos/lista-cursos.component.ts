import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Curso } from "../../../../../modelo/flujos/especializacion/Curso";
import { CURSO_COMPLETO_ESTADO } from "../../../../../util/constantes/especializacion.const";


const estadoClassMap = new Map<string, string>([
  [CURSO_COMPLETO_ESTADO.VALIDACION_CURSO, 'badge-secondary'],
  [CURSO_COMPLETO_ESTADO.CONVOCAORIA, 'badge-primary'],
  [CURSO_COMPLETO_ESTADO.INSCRIPCION, 'badge rounded-pill badge-info'],
  [CURSO_COMPLETO_ESTADO.VALIDACION_REQUISITOS, 'badge-dark'],
  [CURSO_COMPLETO_ESTADO.VALIDACION_PRUEBAS, 'badge-light'],
  [CURSO_COMPLETO_ESTADO.CURSO, 'badge-warning'],
  [CURSO_COMPLETO_ESTADO.REGISTRO_NOTAS, 'badge-success'],
  [CURSO_COMPLETO_ESTADO.CIERRE_PROCESO, 'badge-danger']
]);

@Component({
  selector: 'app-lista-cursos',
  templateUrl: './lista-cursos.component.html',
  styleUrls: ['./lista-cursos.component.scss']
})
export class ListaCursosComponent implements OnInit {

  @Input("cursos") set cursosInput(cursos: Curso[]) {
    this.cursos = cursos;
  }

  @Output() cursoSeleccionado: EventEmitter<Curso | null>

  cursos: Curso[];
  estados = CURSO_COMPLETO_ESTADO;

  constructor() {
    this.cursos = [];
    this.cursoSeleccionado = new EventEmitter<Curso>(null);
  }

  ngOnInit(): void {
  }

  getEstadoClass(estado: string): string {
    return estadoClassMap.get(estado) || 'badge-primary';
  }

  elegirCurso(curso: Curso) {
    this.cursoSeleccionado.emit(curso);
  }
}
