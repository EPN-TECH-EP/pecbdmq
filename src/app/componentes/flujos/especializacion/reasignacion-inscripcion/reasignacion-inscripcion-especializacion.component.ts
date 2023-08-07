import { Component, OnInit } from '@angular/core';
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { Notificacion } from "../../../../util/notificacion";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { Delegado, DelegadoService } from "../../../../servicios/formacion/delegado.service";
import { ComponenteBase } from "../../../../util/componente-base";
import { MdbPopconfirmService } from "mdb-angular-ui-kit/popconfirm";
import { UsuarioAsignado } from "../../../../modelo/flujos/formacion/asignar-usuario";
import { FormControl } from "@angular/forms";
import { catchError } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { of } from "rxjs";
import { FORMACION } from "../../../../util/constantes/fomacion.const";
import { FormacionService } from "../../../../servicios/formacion/formacion.service";
import { InscripcionEsp } from '../../../../modelo/flujos/especializacion/inscripcion-esp';
import { EspInscripcionService } from '../../../../servicios/especializacion/esp-inscripcion.service';
import { ActivatedRoute } from '@angular/router';
import { CursosService } from '../../../../servicios/especializacion/cursos.service';
import { Curso } from '../../../../modelo/flujos/especializacion/Curso';
import {CURSO_COMPLETO_ESTADO} from "../../../../util/constantes/especializacion.const";


@Component({
  selector: 'app-reasignacion-inscripcion-especializacion',
  templateUrl: './reasignacion-inscripcion-especializacion.component.html',
  styleUrls: ['./reasignacion-inscripcion-especializacion.component.scss']
})
export class ReasignacionInscripcionEspecializacionComponent extends ComponenteBase implements OnInit {

  inscripciones: InscripcionEsp[]
  curso: Curso
  estaReasignando: boolean
  codigoInscripcionReasignando: number
  codigoUsuarioReasignado: FormControl<number>
  delegados: Delegado[]
  esEstadoValidacion = false

  headers = [
    { key: 'id', label: 'ID' },
    { key: 'cedula', label: 'Cédula' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'asignado', label: 'Asignado a' },
  ]

  constructor(
    private route: ActivatedRoute,
    private inscripcionService: EspInscripcionService,
    private mdbNotificationService: MdbNotificationService,
    private delegadoService: DelegadoService,
    private popConfirmServiceLocal: MdbPopconfirmService,
    private formacionService: FormacionService,
    private cursosService: CursosService,
  ) {
    super(mdbNotificationService, popConfirmServiceLocal);

    this.curso = null
    this.inscripciones = []
    this.estaReasignando = false
    this.codigoInscripcionReasignando = 0
    this.delegados = []
    this.codigoUsuarioReasignado = new FormControl<number>(0)
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      const codigo = params['codCurso'];
      if (codigo) {
        this.obtenerDatosCurso(codigo);
      }
    });

    if (this.esEstadoValidacion) {

    }

    this.formacionService.getEstadoActual().pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        console.error(errorResponse)
        return of(null);
      })
    ).subscribe({
      next: estado => {

        if (!estado || estado.httpStatusCode !== 200) {
          return;
        }

        if (estado.mensaje === FORMACION.estadoValidacion) {
          this.esEstadoValidacion = true
    this.inscripcionService.listarInscripciones().subscribe({
      next: inscripciones => {
        this.inscripciones = inscripciones
      },
      error: err => {
        Notificacion.notificar(this.mdbNotificationService, "No se pudo cargar las inscripciones", TipoAlerta.ALERTA_ERROR)
        console.log(err)
      }
    });
    this.delegadoService.listar().subscribe({
      next: delegados => {
        this.delegados = delegados
      },
      error: err => {
        Notificacion.notificar(this.mdbNotificationService, "No se pudo cargar los delegados", TipoAlerta.ALERTA_ERROR)
        console.log(err)
      }
    })
        }
      }
    });

  }

  editarFila(inscripcion: InscripcionEsp) {
    this.codigoInscripcionReasignando = inscripcion.codInscripcion;
    this.estaReasignando = true
    this.codigoUsuarioReasignado.valueChanges.subscribe(
      value => {
        console.log(value)
      }
    )
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

  confirmarReasignar(event: any) {
    super.confirmarReasignacionMensaje();
    super.openPopconfirm(event, this.reasignarInscripcion.bind(this));
  }


  reasignarInscripcion() {

    const usuario: UsuarioAsignado = {
      codPostulante: this.codigoInscripcionReasignando,
      codUsuario: this.codigoUsuarioReasignado.value,
    }

    console.log(usuario)

    this.inscripcionService.asignarValidador(this.codigoInscripcionReasignando, this.codigoUsuarioReasignado.value).subscribe({
      next: () => {
        Notificacion.notificar(this.mdbNotificationService, "Inscripción reasignada correctamente", TipoAlerta.ALERTA_OK)
        this.estaReasignando = false
        this.codigoInscripcionReasignando = 0
        this.codigoUsuarioReasignado.setValue(0)

        this.inscripcionService.listarInscripciones().subscribe(
          inscripciones => {
            this.inscripciones = inscripciones
          }
        )
      },
      error: err => {
        Notificacion.notificar(this.mdbNotificationService, "No se pudo reasignar la inscripción", TipoAlerta.ALERTA_ERROR)
        console.log(err)
      }
    })
  }


}
