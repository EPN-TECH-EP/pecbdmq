import {Component, OnInit} from '@angular/core';
import {InscripcionItem} from "../../../../modelo/flujos/formacion/inscripcion-item";
import {ValidacionInscripcionService} from "../../../../servicios/formacion/validacion-inscripcion.service";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {Notificacion} from "../../../../util/notificacion";
import {TipoAlerta} from "../../../../enum/tipo-alerta";
import {Delegado, DelegadoService} from "../../../../servicios/formacion/delegado.service";
import {ComponenteBase} from "../../../../util/componente-base";
import {MdbPopconfirmService} from "mdb-angular-ui-kit/popconfirm";
import {UsuarioAsignado} from "../../../../modelo/flujos/formacion/asignar-usuario";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-reasignacion-inscripcion',
  templateUrl: './reasignacion-inscripcion.component.html',
  styleUrls: ['./reasignacion-inscripcion.component.scss']
})
export class ReasignacionInscripcionComponent extends ComponenteBase implements OnInit {

  inscripciones: InscripcionItem[]
  estaReasignando: boolean
  codigoInscripcionReasignando: number
  codigoUsuarioReasignado: FormControl<number>
  delegados: Delegado[]

  headers = [
    {key: 'id', label: 'ID'},
    {key: 'cedula', label: 'Cédula'},
    {key: 'nombre', label: 'Nombre'},
    {key: 'apellido', label: 'Apellido'},
    {key: 'asignado', label: 'Asignado a'},
  ]

  constructor(
    private validacionInscripcionService: ValidacionInscripcionService,
    private mdbNotificationService: MdbNotificationService,
    private delegadoService: DelegadoService,
    private popConfirmServiceLocal: MdbPopconfirmService,
  ) {
    super(mdbNotificationService, popConfirmServiceLocal);

    this.inscripciones = []
    this.estaReasignando = false
    this.codigoInscripcionReasignando = 0
    this.delegados = []
    this.codigoUsuarioReasignado = new FormControl<number>(0)
  }

  ngOnInit(): void {
    this.validacionInscripcionService.listarInscripciones().subscribe({
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

  editarFila(inscripcion: InscripcionItem) {
    this.codigoInscripcionReasignando = inscripcion.codPostulante;
    this.estaReasignando = true
    this.codigoUsuarioReasignado.valueChanges.subscribe(
      value => {
        console.log(value)
      }
    )
  }

  confirmarReasignar(event: any) {
    super.confirmarReasignacionMensaje();
    super.openPopconfirm(event, this.reasignarInscripcion.bind(this));
  }


  reasignarInscripcion() {

    const usuario: UsuarioAsignado = {
      codPostulante: this.codigoInscripcionReasignando,
      codUsuario: this.codigoUsuarioReasignado.value,
      estado: "ASIGNADO"
    }

    console.log(usuario)

    this.validacionInscripcionService.reasignarInscripcion(usuario).subscribe({
      next: () => {
        Notificacion.notificar(this.mdbNotificationService, "Inscripción reasignada correctamente", TipoAlerta.ALERTA_OK)
        this.estaReasignando = false
        this.codigoInscripcionReasignando = 0
        this.codigoUsuarioReasignado.setValue(0)

        this.validacionInscripcionService.listarInscripciones().subscribe(
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
