import { Component, OnInit } from '@angular/core';
import { Curso } from "../../../../../modelo/flujos/especializacion/Curso";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CursosService } from "../../../../../servicios/especializacion/cursos.service";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { CURSO_COMPLETO_ESTADO } from "../../../../../util/constantes/especializacion.const";
import { TipoAlerta } from "../../../../../enum/tipo-alerta";
import { Notificacion } from "../../../../../util/notificacion";
import { OPCIONES_DATEPICKER } from "../../../../../util/constantes/opciones-datepicker.const";
import { TipoEvaluacion, TiposEvaluacionService } from "../services/tipos-evaluacion.service";
import { PreguntasTipoEvaluacionService, PreguntaTipoEvaluacion } from "../services/preguntas-tipo-evaluacion.service";
import { AutenticacionService } from "../../../../../servicios/autenticacion.service";
import { Usuario } from "../../../../../modelo/admin/usuario";
import { CursoInstructor } from "../../../../../servicios/especializacion/curso.service";
import { CursoInstructorEvaluacion, Evaluacion, EvaluacionService } from "../services/evaluacion.service";
import { of, switchMap, tap } from "rxjs";

@Component({
  selector: 'app-curso-evaluaciones',
  templateUrl: './curso-evaluaciones.component.html',
  styleUrls: ['./curso-evaluaciones.component.scss']
})
export class CursoEvaluacionesComponent implements OnInit {

  cursoSeleccionado: Curso;
  cursos: Curso[]
  cursoInstructor: CursoInstructor;

  usuario: Usuario

  tiposEvaluacion: TipoEvaluacion[];
  preguntasTipoEvaluacion: PreguntaTipoEvaluacion[];

  estaCargando: boolean;
  esVistaListaCursos: boolean;
  esVistaEvaluacionCurso: boolean;

  fechaActual: Date;

  seCreoEvaluacion: boolean;

  protected readonly OPCIONES_DATEPICKER = OPCIONES_DATEPICKER;
  showLoading: boolean = false;
  tipoEvaluacionSeleccionada: TipoEvaluacion;
  formularioEvaluacion: FormGroup;
  evaluacionCreada: Evaluacion;

  constructor(
    private cursosService: CursosService,
    private builder: FormBuilder,
    private ns: MdbNotificationService,
    private auth: AutenticacionService,
    private tiposEvaluacionService: TiposEvaluacionService,
    private preguntasTipoEvaluacionService: PreguntasTipoEvaluacionService,
    private evaluacionService: EvaluacionService
  ) {

    this.usuario = null;
    this.cursoSeleccionado = null;
    this.tipoEvaluacionSeleccionada = null;
    this.cursos = []
    this.tiposEvaluacion = [];
    this.preguntasTipoEvaluacion = [];
    this.cursoSeleccionado = null;
    this.estaCargando = true;
    this.esVistaListaCursos = true;
    this.esVistaEvaluacionCurso = false;
    this.seCreoEvaluacion = false;
    this.fechaActual = new Date();
    this.formularioEvaluacion = new FormGroup({});
    this.construirFormulario();
  }

  ngOnInit(): void {
    this.auth.user$.subscribe({
      next: (usuario) => {
        if (usuario) {
          this.usuario = usuario;
        }
      }
    });

    this.tiposEvaluacionService.listar().subscribe({
      next: (tiposEvaluacion) => {
        this.tiposEvaluacion = tiposEvaluacion;
      }
    })
    this.listarCursos();
  }

  private listarCursos() {
    this.cursosService.listarCursosPorEstado(CURSO_COMPLETO_ESTADO.TODOS).subscribe({
      next: (cursos) => {
        this.cursos = cursos
        this.estaCargando = false;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  private notificar(mensaje: string, tipo: TipoAlerta) {
    Notificacion.notificar(this.ns, mensaje, tipo);
  }

  private construirFormulario() {
    this.formularioEvaluacion = this.builder.group({
      nombre: ['', Validators.required],
    });

  }

  private cargarInformacionCurso(curso: Curso) {
    this.cursosService.getTipoCurso(curso.codCatalogoCursos).subscribe({
      next: (tipoCurso) => {
        this.cursoSeleccionado.tipoCurso = tipoCurso;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }


  cursoSeleccionadoEvent($event: Curso) {
    if ($event) {
      this.cursoSeleccionado = $event;
      console.log(this.cursoSeleccionado);

      this.cursosService.getCursoPorId(this.cursoSeleccionado?.codCursoEspecializacion)
        .pipe(
          switchMap((cursoInstructor) => {
            this.cursoInstructor = cursoInstructor;

            if (cursoInstructor === null) {
              this.notificar("Por favor, asigne un instructor al curso", TipoAlerta.ALERTA_INFO);
              return of(null);
            }

            return this.evaluacionService.existeEvaluacionCurso(cursoInstructor?.codInstructorCurso)
              .pipe(
                switchMap((evaluacion) => {
                  if (evaluacion !== null) {
                    this.seCreoEvaluacion = true;
                    this.evaluacionCreada = evaluacion;
                    return this.preguntasTipoEvaluacionService.listarPorTipoEvaluacion(evaluacion.codTipoEvaluacion);
                  } else {
                    this.seCreoEvaluacion = false;
                    this.evaluacionCreada = null;
                    return of([]); // Un observable vacío en caso de que no haya evaluación
                  }
                })
              );
          })
        )
        .subscribe((preguntas: PreguntaTipoEvaluacion[]) => {
          if (this.cursoInstructor === null || this.cursoInstructor === undefined) {
            return
          }

          if (this.evaluacionCreada !== undefined && this.evaluacionCreada !== null) {
            if (preguntas && preguntas.length > 0) {
              this.evaluacionCreada.preguntas = preguntas;
            } else {
              this.evaluacionCreada.preguntas = [];
            }
          }
          this.cargarInformacionCurso(this.cursoSeleccionado);
          this.esVistaListaCursos = false;
          this.esVistaEvaluacionCurso = true;
        });
    }
  }


  volverAListaCursos() {
    this.esVistaListaCursos = true;
    this.esVistaEvaluacionCurso = false;
    this.cursoSeleccionado = null;
    this.formularioEvaluacion.reset();
    this.tipoEvaluacionSeleccionada = null;
    this.preguntasTipoEvaluacion = [];
    this.evaluacionCreada = null;
    this.seCreoEvaluacion = false;

  }


  mostrarPreguntasSegunTipoEvaluacion(event: any) {
    this.preguntasTipoEvaluacionService.listarPorTipoEvaluacion(this.tipoEvaluacionSeleccionada.codTipoEvaluacion).subscribe({
      next: (preguntas) => {
        this.preguntasTipoEvaluacion = preguntas;
        console.log(this.preguntasTipoEvaluacion);
      }
    });
  }

  onGuardarEvaluacion() {
    if (this.formularioEvaluacion.invalid) {
      this.notificar("Complete los campos requeridos", TipoAlerta.ALERTA_OK);
      return;
    }
    const evaluacion: Evaluacion = {
      codTipoEvaluacion: this.tipoEvaluacionSeleccionada.codTipoEvaluacion,
      nombre: this.formularioEvaluacion.get('nombre').value,
      autor: this.usuario.codDatosPersonales.nombre + ' ' + ' ' + this.usuario.codDatosPersonales.apellido,
      fechaCreacion: this.fechaActual,
      estado: "ACTIVO"
    }
    console.log(evaluacion);

    this.evaluacionService.crear(evaluacion).pipe(
      switchMap((evaluacionCreada) => {
        const data: CursoInstructorEvaluacion = {
          id: {
            codCursoInstructor: this.cursoInstructor.codInstructorCurso,
            codEvaluacion: evaluacionCreada.codEvaluacion,
          },
          estado: "ACTIVO"
        };
        console.log(data);
        return this.evaluacionService.crearInstructorCursoEvaluacion(data);
      }),
      tap(() => {
        this.notificar("Evaluación creada correctamente", TipoAlerta.ALERTA_OK);
      }),
      switchMap(() => {
        return this.evaluacionService.existeEvaluacionCurso(this.cursoInstructor.codInstructorCurso);
      })
    ).subscribe((evaluacion) => {
      this.evaluacionCreada = evaluacion;
      this.preguntasTipoEvaluacionService.listarPorTipoEvaluacion(evaluacion.codTipoEvaluacion).subscribe({
        next: (preguntas) => {
          this.evaluacionCreada.preguntas = preguntas;
          this.seCreoEvaluacion = true;
          this.esVistaEvaluacionCurso = true;
          this.esVistaListaCursos = false;
        }
      });
    });

  }
}
