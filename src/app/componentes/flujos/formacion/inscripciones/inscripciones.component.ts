import {Component, OnInit} from '@angular/core';
import {InscripcionItem} from "../../../../modelo/flujos/formacion/inscripcion-item";
import {ValidacionInscripcionService} from "../../../../servicios/formacion/validacion-inscripcion.service";
import {DatoPersonalService} from "../../../../servicios/dato-personal.service";
import {Router} from "@angular/router";
import {Usuario} from "../../../../modelo/admin/usuario";
import {AutenticacionService} from "../../../../servicios/autenticacion.service";
import {UsuarioAsignado} from "../../../../modelo/flujos/formacion/asignar-usuario";
import {Notificacion} from "../../../../util/notificacion";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {TipoAlerta} from "../../../../enum/tipo-alerta";

@Component({
  selector: 'app-inscripciones',
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.scss']
})
export class InscripcionesComponent implements OnInit {

  usuario               : Usuario = null;
  inscripciones         : InscripcionItem[]
  inscripcionesAsignadas: InscripcionItem[]
  inscripcionesLoaded = false

  headers = [
    {key: 'id', label: 'ID'},
    {key: 'cedula', label: 'Cédula'},
    {key: 'nombre', label: 'Nombre'},
    {key: 'apellido', label: 'Apellido'},
  ]

  constructor(
    private validacionInscripcionService: ValidacionInscripcionService,
    private datoPersonalService: DatoPersonalService,
    private router: Router,
    private autenticacionService: AutenticacionService,
    private mdbNotificationService: MdbNotificationService
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
    this.validacionInscripcionService.listarInscripcionesByIdUsuario(this.usuario.codUsuario).subscribe({
      next: inscripciones => {
        console.log(inscripciones)
        this.inscripcionesAsignadas = inscripciones.filter(inscripcion => inscripcion.estado === 'ASIGNADO')
        console.log('Asignadas', this.inscripcionesAsignadas)
        this.inscripciones = inscripciones.filter(inscripcion => inscripcion.estado === 'PENDIENTE')
        console.log('Pendientes', this.inscripciones)
        this.inscripcionesLoaded = true
      },
      error: err => console.log(err)
    });
  }

  validar(inscripcion: InscripcionItem) {
    this.validacionInscripcionService.idPostulante = inscripcion.codPostulante;
    this.router.navigate(['principal/formacion/validacion']).then()
  }

  asignar(idPostulante: number) {
    const usuarioAsignado: UsuarioAsignado = {
      codPostulante: idPostulante,
      codUsuario: this.usuario.codUsuario,
      estado: 'ASIGNADO'
    }
    this.validacionInscripcionService.asignarValidador(usuarioAsignado).subscribe({
      next:() => {
        const index = this.inscripciones.findIndex(inscripcion => inscripcion.codPostulante === idPostulante);
        if (index !== -1) {
          const inscripcion = this.inscripciones.splice(index, 1)[0];
          this.inscripcionesAsignadas.push(inscripcion);
        }
        Notificacion.notificar(this.mdbNotificationService, "Usuario asignado correctamente", TipoAlerta.ALERTA_OK)
      },
      error: err => {
        if (err.status !== 400) {
          Notificacion.notificar(this.mdbNotificationService, "Error al asignar usuario", TipoAlerta.ALERTA_ERROR)
        }
        Notificacion.notificar(this.mdbNotificationService, "El usuario ya se encuentra asignado", TipoAlerta.ALERTA_WARNING)
        this.inscripciones = this.inscripciones.filter(inscripcion => inscripcion.codPostulante !== idPostulante)
        console.error(err)
      }
    })
  }

}
