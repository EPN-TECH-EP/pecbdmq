import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { MyValidators } from "../../../../util/validators";
import { debounceTime } from "rxjs/operators";
import { EspInscripcionService } from "../../../../servicios/especializacion/esp-inscripcion.service";
import { DatoPersonal } from "../../../../modelo/admin/dato-personal";
import { Estudiante } from "../../../../modelo/flujos/Estudiante";
import { ActivatedRoute } from "@angular/router";
import { Curso } from "../../../../modelo/flujos/especializacion/Curso";
import { CursosService } from "../../../../servicios/especializacion/cursos.service";
import { CURSO_COMPLETO_ESTADO } from "../../../../util/constantes/especializacon.const";

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion-especializacion.component.html',
  styleUrls: ['./inscripcion-especializacion.component.scss']
})
export class InscripcionEspecializacionComponent implements OnInit {

  fechaActual: Date;
  cedula: FormControl;
  datoPersonal: DatoPersonal;
  estudiante: Estudiante;
  curso: Curso;
  correoPersonal: FormControl;
  esEstadoInscripcion: boolean;
  isLoading: boolean;

  constructor(
    private route: ActivatedRoute,
    private inscripcionService: EspInscripcionService,
    private cursosService: CursosService,
  ) {
    this.esEstadoInscripcion = false;
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
    this.inscripcionService.obtenerDatosDelPostulante(cedula).subscribe({
      next: (datos) => {
        this.datoPersonal = datos.datoPersonal;
        this.estudiante = datos.estudiante;
        if (this.datoPersonal.correoPersonal !== null && this.datoPersonal.correoPersonal !== '') {
          this.correoPersonal.clearValidators();
          this.correoPersonal.updateValueAndValidity();
        }
      }
    })
  }

  private obtenerDatosCurso(codigo: number) {
    this.cursosService.obtenerCurso(codigo).subscribe({
      next: (curso) => {
        this.curso = curso;
        this.verificarEstadoInscripcion();
      }
    });
  }

  private verificarEstadoInscripcion() {
    this.cursosService.obtenerEstadoActual(this.curso.codCursoEspecializacion).subscribe({
      next: (estado) => {
        this.esEstadoInscripcion = estado.mensaje === CURSO_COMPLETO_ESTADO.INSCRIPCION;
        this.isLoading = this.esEstadoInscripcion;
      }
    })
  }

  confirmarInscripcion() {
    if (this.correoPersonal.invalid) {
      this.correoPersonal.markAllAsTouched();
      console.log('correo invalido');
      return;
    }
    console.log('confirmar inscripcion');
  }


}
