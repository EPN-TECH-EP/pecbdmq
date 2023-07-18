import { Component, OnInit } from '@angular/core';
import { Paralelo } from "../../../../../modelo/admin/paralelo";
import {
  ESTUDIANTE_NOTA_DISCIPLINA,
  EstudianteNotaDisciplina
} from "../../../../../modelo/flujos/Estudiante";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-registro-notas-disciplinarias',
  templateUrl: './registro-notas-disciplinarias.component.html',
  styleUrls: ['./registro-notas-disciplinarias.component.scss']
})
export class RegistroNotasDisciplinariasComponent implements OnInit {

  estudiantesPorParalelo: {paralelo: Paralelo, estudiantes: EstudianteNotaDisciplina[]}[]
  notaPorEstudianteForm: FormGroup;
  headers: {key: string, label: string}[];

  estaEditandoNota: boolean;
  codEstudianteNotaEditando: number;


  constructor(private builder: FormBuilder) {
    this.headers = [
      { key: 'nombre', label: 'Código único' },
      { key: 'nombre', label: 'Estudiante' },
      { key: 'notaDisciplinaria', label: 'Nota Final Disciplinaria' },
    ];
    this.estudiantesPorParalelo = [
      {
        paralelo: {
          nombreParalelo: 'A',
          codParalelo: 1,
          estado: 'A',
        },
        estudiantes: ESTUDIANTE_NOTA_DISCIPLINA
      },
      {
        paralelo: {
          nombreParalelo: 'B',
          codParalelo: 2,
          estado: 'A',
        },
        estudiantes: ESTUDIANTE_NOTA_DISCIPLINA
      },

    ]
    this.notaPorEstudianteForm = new FormGroup({});
    this.construirFormulario();

  }

  ngOnInit(): void {
  }

  private construirFormulario() {
    this.notaPorEstudianteForm = this.builder.group({
      codNota: [''],
      notaDisciplina: [''],
    });
  }

  editarNota(estudiante: EstudianteNotaDisciplina) {
    this.estaEditandoNota = true;
    this.codEstudianteNotaEditando = estudiante.codNota;
    this.notaPorEstudianteForm.patchValue({
      codEstudiante: estudiante.codNota,
      notaDisciplina: estudiante.notaDisciplina,
    });

  }

  onCancelarEdicionNota() {
    this.estaEditandoNota = false;
    this.codEstudianteNotaEditando = 0;
  }
}
