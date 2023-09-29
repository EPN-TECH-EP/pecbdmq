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
import { CursoTomado } from "../../../../../servicios/formacion/estudiante.service";

@Component({
  selector: 'app-estudiante-evalucion-curso',
  templateUrl: './estudiante-evalucion-curso.component.html',
  styleUrls: ['./estudiante-evalucion-curso.component.scss']
})
export class EstudianteEvalucionCursoComponent implements OnInit {

  existeEvaluacion: boolean = true;

  @Input("curso") set cursoInput(curso: CursoTomado) {
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

  curso: CursoTomado;
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

    console.log(this.curso.codCursoEspecializacion);
    this.cursosService.getCursoInstructorPorId(this.curso?.codCursoEspecializacion).pipe(
      switchMap((cursoInstructor) => {
        console.log(cursoInstructor);
        return this.evaluacionService.existeEvaluacionCurso(cursoInstructor?.codInstructorCurso).pipe(
          switchMap((evaluacion) => {
            if (evaluacion) {
              console.log("evaluacion", evaluacion);
              this.evaluacion = evaluacion;
              console.log(this.estudiante?.codEstudiante, evaluacion.codEvaluacion);
              return this.respuestasEstudianteService.esEncuestaFinalizada(this.estudiante?.codEstudiante, evaluacion.codEvaluacion);
            }
            // Si no hay evaluación, retornamos un observable vacío
            this.existeEvaluacion = false;
            return
          }),
          // Continuar con la obtención de preguntas según el tipo de evaluación (en este caso, tipo 1)
          switchMap((esEncuestaFinalizada) => {
            console.log("esEncuestaFinalizada", esEncuestaFinalizada);
            this.esEncuestaFinalizada = esEncuestaFinalizada;
            if (!esEncuestaFinalizada) {
              // Obtener preguntas por tipo de evaluación
              return this.preguntaService.listarPorTipoEvaluacion(this.evaluacion?.codTipoEvaluacion);
            }
            // Si no hay preguntas, retornamos un observable vacío
            return of([]);
          })
        );
      })
    ).subscribe((preguntas: PreguntaTipoEvaluacion[]) => {
      if (preguntas && preguntas.length > 0) {
        console.log(preguntas);
        this.evaluacion.preguntas = preguntas;
        console.log(this.evaluacion);
        this.construirFormulariosEncuesta();
      }
    });
  }

  private construirFormulariosEncuesta() {
    this.evaluacion.preguntas.forEach((pregunta) => {
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
        codEstudiante: this.estudiante.codEstudiante,
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
