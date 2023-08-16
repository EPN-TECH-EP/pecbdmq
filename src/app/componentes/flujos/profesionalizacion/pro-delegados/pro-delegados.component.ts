import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Usuario} from '../../../../modelo/admin/usuario';
import {ProDelegadoService} from '../../../../servicios/profesionalizacion/pro-delegado.service';
import {ComponenteBase} from '../../../../util/componente-base';
import {
  defaultProDelegado,
  ProDelegadoCreateUpdateDto,
  ProDelegadoDto
} from '../../../../modelo/flujos/profesionalizacion/pro-delegado-dto';
import {MdbNotificationRef, MdbNotificationService} from 'mdb-angular-ui-kit/notification';
import {AlertaComponent} from '../../../util/alerta/alerta.component';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {Notificacion} from '../../../../util/notificacion';

@Component({
  selector: 'app-delegados',
  templateUrl: './pro-delegados.component.html',
  styleUrls: ['./pro-delegado.component.scss']
})
export class ProDelegadosComponent extends ComponenteBase implements OnInit {
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  codigo:number;

  // TODO implement new endpoints
  constructor(
    private delegadoService: ProDelegadoService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
    private builder: FormBuilder,
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);
    this.delegado = defaultProDelegado;
    this.usuarios = [];
    this.delegados = [];

    this.delegadoForm = new FormGroup({});
    this.headers = [
      {key: 'Cod. Delegado', label: 'Cod. Delegado'},
      {key: 'cedula', label: 'Cédula'},
      {key: 'nombre', label: 'Nombres'},

    ]
    this.estaBuscandoUsuarios = false;
    this.estaAgregandoDelegado = false;
    this.existenCoincidencias = true;
  }


  usuarios: Usuario[];
  delegado: ProDelegadoDto;
  delegados: ProDelegadoDto[];

  headers: { key: string, label: string }[];
  delegadoForm: FormGroup;


  estaBuscandoUsuarios: boolean;
  estaAgregandoDelegado: boolean;
  existenCoincidencias: boolean;

  protected readonly defaultDelegado = defaultProDelegado;

  ngOnInit(): void {
    this.delegadoService.getlistarAsignados().subscribe({
      next: (delegados) => {
        this.delegados = delegados;
      },
      error: () => {
        console.error('error al listar delegados');
      }
    })

    this.construirFormularioDelegado();

  }

  usuarioEncontrado(usuario: Usuario) {
    if (!usuario) {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        null,
        'No se encontraron usuarios'
      );
      this.existenCoincidencias = false;
      this.usuarios = [];
      return;
    }
    this.usuarios[0] = usuario;
    this.usuarios.splice(1);
    this.existenCoincidencias = true;
  }

  usuariosEncontrados(usuarios: Usuario[]) {
    this.usuarios = usuarios;
    this.existenCoincidencias = true;
  }

  limpiarResultados() {
    this.usuarios = [];
  }

  onAgregarDelegado(usuario: Usuario) {
    this.delegado = {
      ...this.delegado,
      cedula: usuario.nombreUsuario,
      nombre: usuario.codDatosPersonales.nombre,
      apellido: usuario.codDatosPersonales.apellido,
      correoPersonal: usuario.codDatosPersonales.correoPersonal,
      codDatosPersonales: usuario.codDatosPersonales.codDatosPersonales,
      codUsuario: usuario.codDatosPersonales.codDatosPersonales
    };
    this.estaAgregandoDelegado = true;
    this.estaBuscandoUsuarios = false;
    this.editarDelegado(this.delegado);
  }

  onCancelarEdicionDelegado() {
    this.delegado = defaultProDelegado;
    this.delegadoForm.reset();
  }


  private construirFormularioDelegado() {
    this.delegadoForm = this.builder.group({})
  }

  private editarDelegado(delegado: ProDelegadoDto) {
    delegado = {
      ...this.delegado,
    }
    const delegadoRequest: ProDelegadoCreateUpdateDto = {
      codUsuario: delegado.codDatosPersonales,
      codDelegado: delegado.codDelegado,
      codPeriodoAcademico: null,
    }
    this.delegadoService.crear(delegadoRequest).subscribe({
      next: (value) => {
        this.onCancelarEdicionDelegado();
        this.delegadoService.getlistarAsignados().subscribe({
          next: (delegados) => {
            this.delegados = delegados;
          }
        })
      },
      error: (err) => {
        this.estaAgregandoDelegado = false; delegado = this.defaultDelegado;
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          err
        );
      }
    })
  }

  onEliminarRegistro() {
    this.delegadoService.eliminar(this.delegado.codDelegado).subscribe({
      next: (delegado) => {
        this.delegadoForm.reset();
        this.delegadoService.getlistarAsignados().subscribe({
          next: (delegados) => {
            this.delegados = delegados;
          }
        })
      }
    });
  }

  confirmaEliminarMensaje(){
    this.mensajeConfirmacion = '¿Eliminar el registro? Esta acción es irreversible';
  }

  confirmarEliminar($event: Event, dato: number): void {
    super.confirmaEliminarMensaje();
    this.delegado.codDelegado= dato;
    super.openPopconfirm(event, this.onEliminarRegistro.bind(this));
  }
}
