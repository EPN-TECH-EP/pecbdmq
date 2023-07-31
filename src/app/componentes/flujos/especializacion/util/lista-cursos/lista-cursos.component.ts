import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Curso } from "../../../../../modelo/flujos/especializacion/Curso";

@Component({
  selector: 'app-lista-cursos',
  templateUrl: './lista-cursos.component.html',
  styleUrls: ['./lista-cursos.component.scss']
})
export class ListaCursosComponent implements OnInit {

  @Input("cursos") set cursosInput(cursos: Curso[]) {
    this.cursos = cursos;
  }



  @Output() cursoSeleccionado: EventEmitter<Curso>

  cursos: Curso[];
  estados: any[];

  constructor() {
    this.cursos = [];
    this.cursoSeleccionado = new EventEmitter<Curso>();
  }

  ngOnInit(): void {
  }

}
