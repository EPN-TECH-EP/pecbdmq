import { Component, OnInit } from '@angular/core';
import {
  MateriaPorInstructor,
  RegistroNotasService
} from "../../../../../servicios/formacion/registro-notas.service";
import { Notificacion } from "../../../../../util/notificacion";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { TipoAlerta } from "../../../../../enum/tipo-alerta";
import { Router } from "@angular/router";
import { Paralelo } from "../../../../../modelo/admin/paralelo";
import { Estudiante, NotaPorEstudiante, } from "../../../../../modelo/flujos/Estudiante";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AutenticacionService } from "../../../../../servicios/autenticacion.service";
import { InstructorService } from "../../../../../servicios/formacion/instructor.service";
import { catchError, tap } from "rxjs/operators";
import { EMPTY, of, switchMap } from "rxjs";
import { FormacionService } from "../../../../../servicios/formacion/formacion.service";
import { HttpErrorResponse } from "@angular/common/http";
import { FORMACION } from "../../../../../util/constantes/fomacion.const";
import { ApelacionesService } from "../../../../../servicios/formacion/apelaciones.service";
import { Instructor } from "../../../../../modelo/flujos/instructor";

@Component({
  selector: 'app-registro-notas',
  templateUrl: './registro-notas.component.html',
  styleUrls: ['./registro-notas.component.scss']
})
export class RegistroNotasComponent implements OnInit {

  estudiantesPorParalelo: {paralelo: Paralelo, estudiantes: NotaPorEstudiante[]}[]
  materias: MateriaPorInstructor[];
  materiaSeleccionada: MateriaPorInstructor;
  instructor: Instructor;

  estaEditandoNota: boolean;
  estudianteNotaEditando: NotaPorEstudiante;
  codEstudianteNotaEditando: number;

  estaEnVistaListaMaterias: boolean;
  estaEnVistaRegistroNotas: boolean;
  headers: {key: string, label: string}[];

  notaPorEstudianteForm: FormGroup;
  esEstadoRegistroNotas: boolean;


  constructor(
    private registroNotasService: RegistroNotasService,
    private ns: MdbNotificationService,
    private router: Router,
    private builder: FormBuilder,
    private authService: AutenticacionService,
    private instructorService: InstructorService,
    private formacionService: FormacionService,
    private apelaconService: ApelacionesService
  ) {
    this.estaEditandoNota = false;
    this.codEstudianteNotaEditando = 0;
    this.estaEnVistaListaMaterias = true;
    this.estaEnVistaRegistroNotas = false;
    this.headers = [
      { key: 'nombre', label: 'Código único' },
      { key: 'nombre', label: 'Estudiante' },
      { key: 'noFinal', label: 'Nota Final' },
      { key: 'notaDisciplinaria', label: 'Nota Final Disciplinaria' },
      { key: 'notaDisciplinaria', label: 'Nota Final Supletorio' },
    ];
    this.estudiantesPorParalelo = [];
    this.estudianteNotaEditando = null;
    this.materias = [];
    this.notaPorEstudianteForm = new FormGroup({});
    this.esEstadoRegistroNotas = false;
    this.construirFormulario();
  }

  ngOnInit(): void {

    this.formacionService.getEstadoActual().pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        console.error(errorResponse);
        return of(null);
      }),
      switchMap((estado) => {
        console.log(estado);
        if (!estado || estado.httpStatusCode !== 200) {
          Notificacion.notificar(this.ns, "No se pudo obtener el estado actual", TipoAlerta.ALERTA_WARNING);
          this.router.navigate(['/formacion/proceso']).then();
          return EMPTY;
        }

        if (estado.mensaje === FORMACION.estadoRegistroNotas) {
          this.esEstadoRegistroNotas = true;
          return this.authService.user$.pipe(
            switchMap(user => this.instructorService.getInstructorById(user.codUsuario)),
            tap(instructor => this.instructor = instructor),
            switchMap(instructor => this.registroNotasService.listarMateriasSiEsCoordinador(instructor.codInstructor)),
            tap(materias => {
              if (materias.length === 0) {
                Notificacion.notificar(this.ns, 'No es coordinador, para registrar notas debe ser coordinador de una materia', TipoAlerta.ALERTA_WARNING);
                this.router.navigate(['/principal/formacion/menu-academia']).then();
              }
              this.materias = materias;
            }),
          );
        }

        // no es estado de registro de notas
        return EMPTY;
      })
    ).subscribe({
      error: err => {
        console.log(err);
      }
    });
  }

  private construirFormulario() {
    this.notaPorEstudianteForm = this.builder.group({
      codNota: [''],
      notaFinal: [''],
      notaDisciplinaria: [''],
      notaSupletorio: [''],
    });

    this.notaPorEstudianteForm.valueChanges.subscribe({
      next: value => {
        console.log(value);
      }
    });

  }

  private listarEstudiantesPorCodMateria(codMateria: number) {
    console.log(codMateria);
    this.registroNotasService.listarEstudiantesPorCodMateria(codMateria).subscribe({
      next: data => {
        console.log(data);
        const paralelos = data.paralelos;
        this.estudiantesPorParalelo = paralelos.map(paralelo => {
          const estudiantes = data.estudianteDatos.filter(estudiante =>
            estudiante.codParalelo === paralelo.codParalelo);
          return { paralelo, estudiantes }
        });
      }
    });

  }

  abrirRegistroDeNotas(materia: MateriaPorInstructor) {
    this.materiaSeleccionada = materia;
    this.estaEnVistaListaMaterias = false;
    this.estaEnVistaRegistroNotas = true;
    this.listarEstudiantesPorCodMateria(materia.codMateria);
  }

  abrirListaDeMaterias() {
    this.estaEnVistaListaMaterias = true;
    this.estaEnVistaRegistroNotas = false;
    this.materiaSeleccionada = null;
  }

  editarNota(estudiante: NotaPorEstudiante) {
    this.estaEditandoNota = true;
    this.codEstudianteNotaEditando = estudiante.codNota;
    this.estudianteNotaEditando = estudiante;
    this.notaPorEstudianteForm.patchValue({
      codNota: estudiante.codNota,
      notaFinal: estudiante.notaFinal,
      notaDisciplinaria: estudiante.notaDisciplina,
      notaSupletorio: estudiante.notaSupletorio,
    });
  }

  onCancelarEdicionNota() {
    this.estaEditandoNota = false;
    this.codEstudianteNotaEditando = 0;
    this.notaPorEstudianteForm.reset();
  }

  onGuardarNota() {
    const notaPorEstudiante: NotaPorEstudiante = {
      codNota: this.notaPorEstudianteForm.get('codNota').value,
      notaFinal: this.notaPorEstudianteForm.get('notaFinal').value,
      notaDisciplina: this.notaPorEstudianteForm.get('notaDisciplinaria').value,
      notaSupletorio: this.notaPorEstudianteForm.get('notaSupletorio').value,
      codParalelo: this.estudianteNotaEditando.codParalelo,
      nombreParalelo: this.estudianteNotaEditando.nombreParalelo,
      cedula: this.estudianteNotaEditando.cedula,
      codUnicoEstudiante: this.estudianteNotaEditando.codUnicoEstudiante,
      nombreCompleto: this.estudianteNotaEditando.nombreCompleto,
    };


    this.registroNotasService.registrarNota(notaPorEstudiante.codNota, notaPorEstudiante).subscribe({
      next: () => {
        Notificacion.notificar(this.ns, 'Nota registrada con éxito', TipoAlerta.ALERTA_OK);

        const indexParalelo = this.estudiantesPorParalelo.findIndex(paralelo => paralelo.paralelo.codParalelo === notaPorEstudiante.codParalelo);
        const indexEstudiante = this.estudiantesPorParalelo[indexParalelo].estudiantes.findIndex(estudiante => estudiante.codNota === notaPorEstudiante.codNota);
        this.estudiantesPorParalelo[indexParalelo].estudiantes[indexEstudiante] = notaPorEstudiante;
        this.estudiantesPorParalelo[indexParalelo].estudiantes = [...this.estudiantesPorParalelo[indexParalelo].estudiantes];

        this.onCancelarEdicionNota();
      },
      error: err => {
        Notificacion.notificar(this.ns, err.error.mensaje, TipoAlerta.ALERTA_ERROR);
      }
    });

  }

  abrirApelaciones(materia: MateriaPorInstructor) {
    this.apelaconService.materia = materia;
    this.apelaconService.instructor = this.instructor;
    this.router.navigate(['/principal/formacion/academia/apelaciones']).then();
  }
}
