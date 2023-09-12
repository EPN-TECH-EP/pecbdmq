import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MyValidators} from "../../../../util/validators";
import {debounceTime} from "rxjs/operators";
import {EspInscripcionService} from "../../../../servicios/especializacion/esp-inscripcion.service";
import {DatoPersonal} from "../../../../modelo/admin/dato-personal";
import {Estudiante} from "../../../../modelo/flujos/Estudiante";
import {ActivatedRoute} from "@angular/router";
import {Curso} from "../../../../modelo/flujos/especializacion/Curso";
import {CursosService} from "../../../../servicios/especializacion/cursos.service";

import {TipoAlerta} from "../../../../enum/tipo-alerta";
import {Notificacion} from "../../../../util/notificacion";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {CURSO_COMPLETO_ESTADO} from "../../../../util/constantes/especializacion.const";

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion-especializacion.component.html',
  styleUrls: ['./inscripcion-especializacion.component.scss']
})
export class InscripcionEspecializacionComponent implements OnInit {

  fechaActual: Date;
  archivo: File;
  datoPersonal: DatoPersonal;
  estudiante: Estudiante;
  curso: Curso;
  esEstadoInscripcion: boolean;
  isLoading: boolean;
  esBotonDeshabilitado: boolean;
  loading: boolean;
  esInscripcionCompletada: boolean;
  correoPersonal: FormControl;
  cedula: FormControl;
  archivoForm: FormControl;


  constructor(
    private route: ActivatedRoute,
    private inscripcionService: EspInscripcionService,
    private cursosService: CursosService,
    private ns: MdbNotificationService
  ) {
    this.esEstadoInscripcion = false;
    this.esInscripcionCompletada = false;
    this.esBotonDeshabilitado = false;
    this.isLoading = false;
    this.fechaActual = new Date();
    this.datoPersonal = null;
    this.estudiante = null;
    this.curso = null;
    this.cedula = new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      MyValidators.validIdentification(),
      MyValidators.onlyNumbers()],
    );
    this.correoPersonal = new FormControl('', [
      Validators.required,
      Validators.email,
    ]);
    this.archivoForm = new FormControl('', Validators.required)
    this.loading = false;
    this.escucharCedula()
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const codigo = params['codCurso'];
      if (codigo) {
        this.obtenerDatosCurso(codigo);
      }
    });
  }

  private mostrarNotificacion(mensaje: string, tipo: TipoAlerta,) {
    Notificacion.notificar(this.ns, mensaje, tipo)
  }

  private guardarCorreo() {
    this.loading = true;
    this.inscripcionService.colocarCorreoPersonal(this.datoPersonal).subscribe({
      next: (datos) => {
        this.datoPersonal = datos.datoPersonal;
        this.estudiante = datos.estudiante;
        this.esBotonDeshabilitado = false;
        this.loading = false;
      },
      error: (err) => {
        this.mostrarNotificacion(err.error.mensaje, TipoAlerta.ALERTA_ERROR);
        this.datoPersonal.correoPersonal = null;
        this.esBotonDeshabilitado = true;
        this.loading = false;
      }
    });
  }

  private escucharCedula() {
    this.cedula.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (value) => {
        if (this.cedula.invalid) {
          this.datoPersonal = null;
          this.estudiante = null;
          return;
        }

        this.obtenerDatos(value);
      }
    });
  }

  private obtenerDatos(cedula: string) {
    this.esInscripcionCompletada = false;
    this.loading = true;
    this.inscripcionService.obtenerDatosDelPostulante(cedula, this.curso.codCursoEspecializacion).subscribe({
      next: (datos) => {
        this.datoPersonal = datos.datoPersonal;
        this.estudiante = datos.estudiante;
        if (this.datoPersonal.correoPersonal !== null && this.datoPersonal.correoPersonal !== '') {
          this.correoPersonal.clearValidators();
          this.correoPersonal.updateValueAndValidity();
          this.loading = false;
          return;
        }
        this.esBotonDeshabilitado = true;
        this.loading = false;
      },
      error: (err) => {
        this.mostrarNotificacion(err.error.mensaje, TipoAlerta.ALERTA_ERROR);
        this.datoPersonal = null;
        this.estudiante = null;
        this.loading = false;
      }
    })
  }

  private obtenerDatosCurso(codigo: number) {
    this.cursosService.obtenerCurso(codigo).subscribe({
      next: (curso) => {
        this.curso = curso;
        console.log(this.curso);
        this.verificarEstadoInscripcion();
      },
      error: (err) => {
        this.mostrarNotificacion(err.error.mensaje, TipoAlerta.ALERTA_ERROR);
        this.curso = null;
      }
    });
  }

  private verificarEstadoInscripcion() {
    this.cursosService.obtenerEstadoActual(this.curso.codCursoEspecializacion).subscribe({
      next: (estado) => {
        this.esEstadoInscripcion = estado.mensaje === CURSO_COMPLETO_ESTADO.INSCRIPCION;
        this.isLoading = this.esEstadoInscripcion;
      },
      error: (err) => {
        this.mostrarNotificacion(err.error.mensaje, TipoAlerta.ALERTA_ERROR);
        this.esEstadoInscripcion = false;
        this.isLoading = false;
      }
    })
  }

  onConfirmarInscripcion() {
    if (this.archivoForm.invalid) {
      this.archivoForm.markAllAsTouched();
      this.mostrarNotificacion('Seleccione un archivo', TipoAlerta.ALERTA_WARNING);
      return;
    }

    const formData = new FormData();
    formData.append('documentos', this.archivo);
    formData.append('datos', JSON.stringify({
      codEstudiante: this.estudiante.codEstudiante,
      codCursoEspecializacion: this.curso.codCursoEspecializacion
    }));

    this.inscripcionService.confirmarInscripcion(formData).subscribe({
      next: () => {
        this.mostrarNotificacion('Inscripción realizada con éxito', TipoAlerta.ALERTA_OK);
        this.esInscripcionCompletada = true;
      },
      error: (err) => {
        this.mostrarNotificacion(err.error.mensaje, TipoAlerta.ALERTA_ERROR);
        if (err.error.httpStatusCode === 400) {
          this.esInscripcionCompletada = false;
        }
      }
    });

  }

  onActualizarCorreoPersonal() {
    if (this.correoPersonal.invalid) {
      this.correoPersonal.markAllAsTouched();
      this.mostrarNotificacion('Ingrese un correo válido', TipoAlerta.ALERTA_WARNING);
      return;
    }
    this.datoPersonal.correoPersonal = this.correoPersonal.value;
    this.guardarCorreo()
  }

  agregarArchivo($event: Event) {
    const archivo = ($event.target as HTMLInputElement).files[0];
    this.archivo = archivo;
    this.archivoForm.setValue(archivo.name);
  }
}
