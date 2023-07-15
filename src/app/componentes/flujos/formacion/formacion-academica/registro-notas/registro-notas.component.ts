import { Component, OnInit } from '@angular/core';
import {
  MateriaPorInstrutor,
  RegistroNotasService
} from "../../../../../servicios/formacion/registro-notas.service";
import { Notificacion } from "../../../../../util/notificacion";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { TipoAlerta } from "../../../../../enum/tipo-alerta";
import { Router } from "@angular/router";
import { Paralelo } from "../../../../../modelo/admin/paralelo";
import { Estudiante } from "../../../../../modelo/flujos/Estudiante";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MateriaFormacion } from "../../../../../servicios/formacion/materias-formacion.service";
import { AutenticacionService } from "../../../../../servicios/autenticacion.service";
import { InstructorService } from "../../../../../servicios/formacion/instructor.service";
import { tap } from "rxjs/operators";
import { switchMap } from "rxjs";

@Component({
  selector: 'app-registro-notas',
  templateUrl: './registro-notas.component.html',
  styleUrls: ['./registro-notas.component.scss']
})
export class RegistroNotasComponent implements OnInit {

  estudiantesPorParalelo: {paralelo: Paralelo, estudiantes: Estudiante[]}[]
  materias: MateriaPorInstrutor[];
  materiaSeleccionada: MateriaPorInstrutor;


  estaEditandoNota: boolean;
  codEstudienteEditando: number;


  estaEnVistaListaMaterias: boolean;
  estaEnVistaRegistroNotas: boolean;
  headers: {key: string, label: string}[];

  notaPorEstudianteForm: FormGroup;


  constructor(
    private registroNotasService: RegistroNotasService,
    private ns: MdbNotificationService,
    private router: Router,
    private builder: FormBuilder,
    private authService: AutenticacionService,
    private instructorService: InstructorService,
  ) {
    this.estaEditandoNota = false;
    this.codEstudienteEditando = 0;
    this.estaEnVistaListaMaterias = true;
    this.estaEnVistaRegistroNotas = false;
    this.headers = [
      { key: 'nombre', label: 'Estudiante' },
      { key: 'noFinal', label: 'Nota Final' },
      { key: 'notaDisciplinaria', label: 'Nota Final Disciplinaria' },
      { key: 'notaDisciplinaria', label: 'Nota Final Supletorio' },
    ];
    this.estudiantesPorParalelo = [];
    this.materias = [];
    this.notaPorEstudianteForm = new FormGroup({});
    this.construirFormulario();
  }

  ngOnInit(): void {

    this.authService.user$.pipe(
      switchMap(user => this.instructorService.getInstructorById(user.codUsuario)),
      switchMap(instructor => this.registroNotasService.listarMateriasSiEsCoordinador(instructor.codInstructor)),
      tap(materias => {
        if (materias.length === 0) {
          Notificacion.notificar(this.ns, 'No es coordinador, para registrar notas debe ser coordinador de una materia', TipoAlerta.ALERTA_WARNING);
          this.router.navigate(['/principal/formacion/academia/menu']);
        }
        this.materias = materias;
      })
    ).subscribe({
      error: err => {
        console.log(err);
      }
    });

  }

  private construirFormulario() {
    this.notaPorEstudianteForm = this.builder.group({
      notaFinal: [''],
      notaDisciplinaria: [''],
      notaSupletorio: [''],
    });

  }

  abrirRegistroDeNotas(materia: MateriaPorInstrutor) {
    this.materiaSeleccionada = materia;
    this.estaEnVistaListaMaterias = false;
    this.estaEnVistaRegistroNotas = true;
  }

  abrirListaDeMaterias() {
    this.estaEnVistaListaMaterias = true;
    this.estaEnVistaRegistroNotas = false;
    this.materiaSeleccionada = null;
  }
}
