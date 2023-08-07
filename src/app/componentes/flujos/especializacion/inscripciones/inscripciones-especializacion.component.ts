import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Usuario } from "../../../../modelo/admin/usuario";
import { AutenticacionService } from "../../../../servicios/autenticacion.service";
import { Notificacion } from "../../../../util/notificacion";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { FormacionService } from "../../../../servicios/formacion/formacion.service";
import { catchError } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { of } from "rxjs";
import { FORMACION } from "../../../../util/constantes/fomacion.const";
import { DelegadoService } from "../../../../servicios/formacion/delegado.service";
import { InscripcionEsp } from '../../../../modelo/flujos/especializacion/inscripcion-esp';
import { EspInscripcionService } from '../../../../servicios/especializacion/esp-inscripcion.service';
import { Curso } from '../../../../modelo/flujos/especializacion/Curso';
import { CursosService } from '../../../../servicios/especializacion/cursos.service';
import { CURSO_COMPLETO_ESTADO } from '../../../../util/constantes/especializacon.const';

@Component({
  selector: 'app-inscripciones-especializacion',
  templateUrl: './inscripciones-especializacion.component.html',
  styleUrls: ['./inscripciones-especializacion.component.scss']
})
export class InscripcionesEspecializacionComponent implements OnInit {

  usuario: Usuario = null
  inscripciones: InscripcionEsp[]
  inscripcionesAsignadas: InscripcionEsp[]
  curso: Curso
  inscripcionesLoaded = false
  esEstadoValidacion = false
  esEstadoMuestreo = false

  headers = [
    { key: 'id', label: 'ID' },
    { key: 'cedula', label: 'Cédula' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
  ]

  constructor(
    private route: ActivatedRoute,
    private inscripcionService: EspInscripcionService,
    private router: Router,
    private autenticacionService: AutenticacionService,
    private mdbNotificationService: MdbNotificationService,
    private formacionService: FormacionService,
    private delegadoService: DelegadoService,
    private cursosService: CursosService,
  ) {
    this.inscripcionesAsignadas = []
    this.inscripciones = []
    this.autenticacionService.user$.subscribe({
      next: usuario => {
        this.usuario = usuario
      }
    })

  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      const codigo = params['codCurso'];
      if (codigo) {
        this.obtenerDatosCurso(codigo);
      }
    });

    if (!this.esEstadoValidacion) {
      return;
    }

    this.delegadoService.esDelegado(this.usuario.codUsuario).subscribe({
      next: esDelegado => {
        if (!esDelegado) {
          Notificacion.notificar(this.mdbNotificationService, "No es usuario delegado", TipoAlerta.ALERTA_WARNING)
          this.router.navigate(['/principal/especializacion/menu-validacion'])
          return
        }
      },
      error: () => {
        Notificacion.notificar(this.mdbNotificationService, "Ocurrió un error, inténtelo nuevamente", TipoAlerta.ALERTA_ERROR)
        this.router.navigate(['/principal/especializacion/menu-validacion'])
        return
      }
    })

    this.formacionService.getEstadoActual().pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        console.error(errorResponse)
        return of(null);
      })
    ).subscribe({
      next: estado => {

        if (!estado || estado.httpStatusCode !== 200) {
          Notificacion.notificar(this.mdbNotificationService, "No se pudo obtener el estado actual", TipoAlerta.ALERTA_WARNING)
          this.router.navigate(['/principal/especializacion/menu-validacion'])
          return;
        }

        if (estado.mensaje === FORMACION.estadoValidacion) {

          this.esEstadoValidacion = true

          this.inscripcionService.listarInscripcionesByIdUsuario(this.usuario.codUsuario).subscribe({
            next: inscripciones => {
              console.log(inscripciones)
              this.inscripcionesAsignadas = inscripciones.filter(inscripcion => inscripcion.estado === 'ASIGNADO')
              this.inscripciones = inscripciones.filter(inscripcion => inscripcion.estado === 'PENDIENTE')
              this.inscripcionesLoaded = true
            },
            error: err => console.log(err)
          });
        }

      }
    })


  }

  private obtenerDatosCurso(codigo: number) {
    this.cursosService.obtenerCurso(codigo).subscribe({
      next: (curso) => {
        this.curso = curso;
        this.verificarEstadoCurso();
      }
    });
  }

  private verificarEstadoCurso() {
    this.cursosService.obtenerEstadoActual(this.curso.codCursoEspecializacion).subscribe({
      next: (estado) => {
        this.esEstadoValidacion = estado.mensaje === CURSO_COMPLETO_ESTADO.VALIDACION_REQUISITOS;
      }
    })
  }

  validar(inscripcion: InscripcionEsp) {
    this.inscripcionService.idInscripcion = inscripcion.codInscripcion;
    this.router.navigate(['principal/especializacion/validacion']).then()
  }

  asignar(idInscripcion: number) {
    this.inscripcionService.asignarValidador(idInscripcion, this.usuario.codUsuario).subscribe({
      next: (data) => {
        console.log(data)
        const index = this.inscripciones.findIndex(inscripcion => inscripcion.codInscripcion === idInscripcion);
        if (index !== -1) {
          const inscripcion = this.inscripciones.splice(index, 1)[0];
          this.inscripcionesAsignadas.push(inscripcion);
          this.inscripciones = this.inscripciones.filter(inscripcion => inscripcion.codInscripcion !== idInscripcion)
        }
        Notificacion.notificar(this.mdbNotificationService, "Usuario asignado correctamente", TipoAlerta.ALERTA_OK)
      },
      error: err => {
        if (err.status !== 400) {
          Notificacion.notificar(this.mdbNotificationService, "Error al asignar usuario", TipoAlerta.ALERTA_ERROR)
        }
        Notificacion.notificar(this.mdbNotificationService, "El usuario ya se encuentra asignado", TipoAlerta.ALERTA_WARNING)
        this.inscripciones = this.inscripciones.filter(inscripcion => inscripcion.codInscripcion !== idInscripcion)
        console.error(err)
      }
    })
  }

}
