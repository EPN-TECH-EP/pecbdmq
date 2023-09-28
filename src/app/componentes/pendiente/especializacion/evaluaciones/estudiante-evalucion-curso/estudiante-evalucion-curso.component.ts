import { Component, Input, OnInit } from '@angular/core';
import { Curso } from "../../../../../modelo/flujos/especializacion/Curso";
import { Evaluacion, EvaluacionService } from "../services/evaluacion.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PreguntasTipoEvaluacionService, PreguntaTipoEvaluacion } from "../services/preguntas-tipo-evaluacion.service";
import { of, switchMap } from "rxjs";
import { CursosService } from "../../../../../servicios/especializacion/cursos.service";
import { RespuestaEstudiante, RespuestasEstudiantesService } from "../services/respuestas-estudiantes.service";
import { Notificacion } from "../../../../../util/notificacion";
import { TipoAlerta } from "../../../../../enum/tipo-alerta";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { Estudiante } from "../../../../../modelo/flujos/Estudiante";

@Component({
  selector: 'app-estudiante-evalucion-curso',
  templateUrl: './estudiante-evalucion-curso.component.html',
  styleUrls: ['./estudiante-evalucion-curso.component.scss']
})
export class EstudianteEvalucionCursoComponent implements OnInit {

  @Input("curso") set cursoInput(curso: Curso) {
    // if (curso === null || curso === undefined) {
    //   return;
    // }
    this.curso = curso;
  }
  @Input("estudiante") set estudianteInput(estudiante: Estudiante) {
    // if (curso === null || curso === undefined) {
    //   return;
    // }
    this.estudiante = estudiante;
  }

  curso: Curso;
  estudiante: Estudiante;
  evaluacion: Evaluacion;
  esEncuestaFinalizada: boolean = false;
  listaPreguntasFormulario: FormGroup[] = [];

  constructor(
    private cursosService: CursosService,
    private formBuilder: FormBuilder,
    private evaluacionService: EvaluacionService,
    private preguntaService: PreguntasTipoEvaluacionService,
    private respuestasEstudianteService: RespuestasEstudiantesService,
    private ns: MdbNotificationService,
  ) {
    this.evaluacion = null;

  }

  ngOnInit(): void {

    // Obtener el curso por ID (74 en este ejemplo)
    this.cursosService.getCursoPorId(74).pipe(
      switchMap((cursoInstructor) => {
        // Verificar si existe una evaluación para el curso (69 en este ejemplo)
        return this.evaluacionService.existeEvaluacionCurso(69).pipe(
          switchMap((evaluacion) => {
            if (evaluacion) {
              this.evaluacion = evaluacion;
              // Verificar si la encuesta está finalizada para el estudiante (113 en este ejemplo)
              return this.respuestasEstudianteService.esEncuestaFinalizada(113, evaluacion.codEvaluacion);
            }
            // Si no hay evaluación, retornamos un observable vacío
            return of(false);
          }),
          // Continuar con la obtención de preguntas según el tipo de evaluación (en este caso, tipo 1)
          switchMap((esEncuestaFinalizada) => {
            this.esEncuestaFinalizada = esEncuestaFinalizada;
            // Obtener preguntas por tipo de evaluación
            return this.preguntaService.listarPorTipoEvaluacion(1);
          })
        );
      })
    ).subscribe((preguntas: PreguntaTipoEvaluacion[]) => {
      if (preguntas && preguntas.length > 0) {
        this.evaluacion.preguntas = preguntas;
        console.log(this.evaluacion);
        this.construirFormulariosEncuesta();
      } else {
        this.evaluacion.preguntas = [];
      }
    });
  }

  private construirFormulariosEncuesta() {
    this.evaluacion.preguntas.forEach((pregunta, index) => {
      this.listaPreguntasFormulario.push(this.formBuilder.group({
        pregunta: [pregunta.pregunta, [Validators.required]],
        estado: ['', [Validators.required]],
      }));
    });
  }

  onGuardarEncuesta() {
    if (this.listaPreguntasFormulario.some((formulario) => formulario.invalid)) {
      Notificacion.notificar(this.ns, "Llenar todos los campos", TipoAlerta.ALERTA_WARNING)
      return;
    }

    const respuestas: RespuestaEstudiante[] = []

    this.listaPreguntasFormulario.forEach((formulario, index) => {
      const respuesta: RespuestaEstudiante = {
        codEvaluacion: this.evaluacion.codEvaluacion,
        codPreguntaTipoEvaluacion: this.evaluacion.preguntas[index].codPregunta,
        codEstudiante: 113,
        respuesta: formulario.value.estado,
        estado: "ACTIVO",
        fechaRespuesta: new Date()
      }
      respuestas.push(respuesta);
    });

    console.log(respuestas);

    this.respuestasEstudianteService.guardarRespuestas(respuestas).subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        this.esEncuestaFinalizada = true;
      }
    })

  }

}
