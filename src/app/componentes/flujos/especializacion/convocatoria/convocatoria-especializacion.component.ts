import { Component, OnInit } from '@angular/core';
import { Curso } from "../../../../modelo/flujos/especializacion/Curso";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CursosService } from "../../../../servicios/especializacion/cursos.service";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { Notificacion } from "../../../../util/notificacion";
import { CURSO_COMPLETO_ESTADO } from "../../../../util/constantes/especializacion.const";
import { OPCIONES_DATEPICKER } from "../../../../util/constantes/opciones-datepicker.const";
import {
  ConvocatoriaEspecializacion,
  EspConvocatoriaService
} from "../../../../servicios/especializacion/esp-convocatoria.service";

@Component({
  selector: 'app-convocatoria',
  templateUrl: './convocatoria-especializacion.component.html',
  styleUrls: ['./convocatoria-especializacion.component.scss']
})
export class ConvocatoriaEspecializacionComponent implements OnInit {

  cursoSeleccionado: Curso;
  cursos: Curso[]

  estaCargando: boolean;
  esVistaListaCursos: boolean;
  esVistaConvocatoriaCurso: boolean;

  convocatoriaCursoForm: FormGroup;
  fechaActual: Date;

  seCreoConvocatoria: boolean;
  codConvocatoriaCreada: number;

  protected readonly OPCIONES_DATEPICKER = OPCIONES_DATEPICKER;

  constructor(
    private cursosService: CursosService,
    private builder: FormBuilder,
    private ns: MdbNotificationService,
    private convocatoriaService: EspConvocatoriaService
  ) {
    this.cursoSeleccionado = null;
    this.estaCargando = true;
    this.codConvocatoriaCreada = 0
    this.esVistaListaCursos = true;
    this.esVistaConvocatoriaCurso = false;
    this.seCreoConvocatoria = false;
    this.cursos = []
    this.fechaActual = new Date();
    this.convocatoriaCursoForm = new FormGroup({});
    this.construirFormulario();
  }

  ngOnInit(): void {
    this.listarCursos();
  }

  private listarCursos() {
    this.cursosService.listarCursosPorEstado(CURSO_COMPLETO_ESTADO.CONVOCAORIA).subscribe({
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
    this.convocatoriaCursoForm = this.builder.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]]
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

  private crearConvocatoria() {

    // formateo de fechas YYYY-MM-DD para el backend
    const fechaInicioDate: Date = this.fechaInicioField.value;
    const fechaFinDate: Date = this.fechaFinField.value;

    const fechaInicio = `${ fechaInicioDate.getFullYear() }-${ fechaInicioDate.getMonth() + 1 < 10 ? `0${ fechaInicioDate.getMonth() + 1 }` : fechaInicioDate.getMonth() + 1 }-${ fechaInicioDate.getDate() }`;
    const fechaFin = `${ fechaFinDate.getFullYear() }-${ fechaFinDate.getMonth() + 1 < 10 ? `0${ fechaFinDate.getMonth() + 1 }` : fechaFinDate.getMonth() + 1 }-${ fechaFinDate.getDate() }`;


    const convocatoria: ConvocatoriaEspecializacion = {
      correo: this.correoField.value,
      nombreConvocatoria: `Convocatoria: ${ this.cursoSeleccionado.nombre }`,
      fechaFinConvocatoria: fechaInicio,
      fechaInicioConvocatoria: fechaFin,
      codCursoEspecializacion: this.cursoSeleccionado.codCursoEspecializacion,
    }
    console.log(convocatoria);

    this.convocatoriaService.crear(convocatoria).subscribe({
      next: (convocatoria) => {
        console.log(convocatoria);
        this.notificar('Convocatoria creada correctamente', TipoAlerta.ALERTA_OK);
        this.seCreoConvocatoria = true;
        this.codConvocatoriaCreada = convocatoria.codConvocatoria;
      },
      error: (err) => {
        console.error(err);
        this.notificar('Error al crear la convocatoria', TipoAlerta.ALERTA_ERROR);
      }
    })
  }

  cursoSeleccionadoEvent($event: Curso) {
    if ($event) {
      this.cursoSeleccionado = $event;
      this.cargarInformacionCurso(this.cursoSeleccionado)
      this.esVistaListaCursos = false;
      this.esVistaConvocatoriaCurso = true;
      console.log($event)
    }
  }

  volverAListaCursos() {
    this.esVistaListaCursos = true;
    this.esVistaConvocatoriaCurso = false;
    this.cursoSeleccionado = null;
    this.convocatoriaCursoForm.reset();
  }

  get fechaInicioField() {
    return this.convocatoriaCursoForm.get('fechaInicio');
  }

  get fechaFinField() {
    return this.convocatoriaCursoForm.get('fechaFin');
  }

  get correoField() {
    return this.convocatoriaCursoForm.get('correo');
  }

  onCrearConvocatoria() {
    if (this.convocatoriaCursoForm.invalid) {
      this.notificar('Debe ingresar todos los campos', TipoAlerta.ALERTA_WARNING);
      this.convocatoriaCursoForm.markAllAsTouched();
      return;
    }

    this.crearConvocatoria();
  };


  onEnviarNotificacion() {
    this.convocatoriaService.enviarNotificacion(this.codConvocatoriaCreada).subscribe({
      next: (resp) => {
        console.log(resp);
        this.notificar('Notificaciones enviadas correctamente', TipoAlerta.ALERTA_OK);
      },
      error: (err) => {
        console.error(err);
        this.notificar('Error al enviar las notificaciones', TipoAlerta.ALERTA_ERROR);
      }
    });

  }
}
