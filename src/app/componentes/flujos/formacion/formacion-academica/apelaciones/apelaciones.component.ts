import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { catchError, tap } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { EMPTY, of, switchMap } from "rxjs";
import { Notificacion } from "../../../../../util/notificacion";
import { TipoAlerta } from "../../../../../enum/tipo-alerta";
import { FORMACION } from "../../../../../util/constantes/fomacion.const";
import { Router } from "@angular/router";
import { FormacionService } from "../../../../../servicios/formacion/formacion.service";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { ApelacionesService, ApelacionResponse } from "../../../../../servicios/formacion/apelaciones.service";
import { MateriaPorInstructor } from "../../../../../servicios/formacion/registro-notas.service";
import { Instructor } from "../../../../../modelo/flujos/instructor";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-apelaciones',
  templateUrl: './apelaciones.component.html',
  styleUrls: ['./apelaciones.component.scss']
})
export class ApelacionesComponent implements OnInit {


  esEstadoFormacionAcademica: boolean;
  materia: MateriaPorInstructor;
  instructor: Instructor;
  apelaciones: ApelacionResponse[];
  apelacionesFiltradas: ApelacionResponse[];

  apelacionSeleccionada: ApelacionResponse;
  codApelacionSeleccionada: number;

  estaEditandoApelacion: boolean;

  headers: {key: string, label: string}[];
  apelacionForm: FormGroup;

  constructor(
    private router: Router,
    private formacionService: FormacionService,
    private ns: MdbNotificationService,
    private apelacionesService: ApelacionesService,
    private builder: FormBuilder,
  ) {
    this.headers = [
      { key: 'fecha', label: 'Fecha solicitud' },
      { key: 'estudiante', label: 'Estudiante' },
      { key: 'observacion', label: 'Observación Estudiante' },
      { key: 'observacion', label: 'Nota Actual' },
      { key: 'observacion', label: 'Observación Instructor' },
      { key: 'observacion', label: 'Nota Corregida' },
      { key: 'observacion', label: 'Estado' },

    ]
    this.instructor = null;
    this.estaEditandoApelacion = false;
    this.codApelacionSeleccionada = 0;
    this.esEstadoFormacionAcademica = false;
    this.materia = null;
    this.apelacionSeleccionada = null;
    this.apelaciones = [];
    this.apelacionesFiltradas = [];
    this.apelacionForm = new FormGroup({});
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

        if (this.apelacionesService.materia === null) {
          this.router.navigate(['principal/formacion/academia/notas']).then();
          return EMPTY;
        }

        if (estado.mensaje === FORMACION.estadoRegistroNotas) {

          this.esEstadoFormacionAcademica = true;
          this.materia = this.apelacionesService.materia;
          this.instructor = this.apelacionesService.instructor;
          this.apelacionesService.listarPorMateria(this.materia.codMateria).subscribe({
            next: (apelaciones) => {
              this.apelaciones = apelaciones;
              this.apelacionesFiltradas = apelaciones;
            },
            error: (err) => {
              console.error(err);
              Notificacion.notificar(this.ns, "No se pudo obtener las apelaciones", TipoAlerta.ALERTA_ERROR);
            }
          });
        }
        return EMPTY;
      })
    ).subscribe({
      error: err => {
        console.log(err);
      }
    });
  }

  private construirFormulario() {
    this.apelacionForm = this.builder.group({
      observacion: [''],
      notaCorregida: [''],
      aprobacion: ['', Validators.required],
    });

    this.apelacionForm.get('aprobacion')?.valueChanges.subscribe({
      next: (aprobado) => {
        const notaCorregidaControl = this.apelacionForm.get('notaCorregida');
        const observacionControl = this.apelacionForm.get('observacion');

        if (!aprobado) {
          notaCorregidaControl?.clearValidators();
          notaCorregidaControl?.setValue('');
          observacionControl?.clearValidators();
          Notificacion.notificar(this.ns, "No es necesario llenar todos los campos si rechaza una apelación", TipoAlerta.ALERTA_WARNING);
        } else {
          notaCorregidaControl?.setValidators([Validators.required]);
          observacionControl?.setValidators([Validators.required]);
        }

        notaCorregidaControl?.updateValueAndValidity();
        observacionControl?.updateValueAndValidity();
      }
    });
  }

  private actualizarApelaciones() {
    this.apelacionesService.listarPorMateria(this.materia.codMateria).subscribe({
      next: (apelaciones) => {
        console.log(apelaciones);
        this.apelaciones = apelaciones;
        this.apelacionesFiltradas = apelaciones;
        this.apelacionesFiltradas = [...this.apelacionesFiltradas];
      },
      error: (err) => {
        console.error(err);
        Notificacion.notificar(this.ns, "No se pudo obtener las apelaciones", TipoAlerta.ALERTA_ERROR);
      }
    });
  }

  onFiltrarPendientes() {
    this.apelacionesFiltradas = this.apelaciones.filter((apelacion) => {
      return apelacion.aprobacion === null;
    });
  }

  onFiltrarAprobados() {
    this.apelacionesFiltradas = this.apelaciones.filter((apelacion) => {
      return apelacion.aprobacion === true;
    });
  }

  onFiltrarRechazados() {
    this.apelacionesFiltradas = this.apelaciones.filter((apelacion) => {
      return apelacion.aprobacion === false;
    });
  }

  onFiltrarTodos() {
    this.apelacionesFiltradas = this.apelaciones;
  }

  onEditarApelacion(apelacion: ApelacionResponse) {
    this.estaEditandoApelacion = true;
    this.apelacionSeleccionada = apelacion;
    this.codApelacionSeleccionada = apelacion.codApelacion;
  }

  onCancelarApelacion() {
    this.estaEditandoApelacion = false;
    this.apelacionSeleccionada = null;
    this.codApelacionSeleccionada = 0;

  }

  onGuardarApelacion(apelacion: ApelacionResponse) {
    if (this.apelacionForm.invalid) {
      this.apelacionForm.markAllAsTouched();
      Notificacion.notificar(this.ns, "Debe llenar todos los campos", TipoAlerta.ALERTA_WARNING);
      return;
    }

    apelacion = {
      ...apelacion,
      observacionInstructor: this.apelacionForm.get('observacion')?.value,
      notaNueva: this.apelacionForm.get('notaCorregida')?.value,
      aprobacion: this.apelacionForm.get('aprobacion')?.value,
    }

    console.log(apelacion);

    this.apelacionesService.actualizar(apelacion).subscribe({
      next: (response) => {
        console.log(response);
        Notificacion.notificar(this.ns, "Apelación aprobada", TipoAlerta.ALERTA_OK);
        this.onCancelarApelacion();
        this.actualizarApelaciones();
      },
      error: (err) => {
        console.error(err);
        Notificacion.notificar(this.ns, "No se pudo aprobar la apelación", TipoAlerta.ALERTA_ERROR);
      }
    })
  }
}
