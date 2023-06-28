import { Component, OnInit } from '@angular/core';
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { UsuarioService } from "../../../../servicios/usuario.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Usuario } from "../../../../modelo/admin/usuario";
import { MyValidators } from "../../../../util/validators";
import { HttpErrorResponse } from "@angular/common/http";
import { Notificacion } from "../../../../util/notificacion";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { UsuarioNombreApellido } from "../../../../modelo/util/nombre-apellido";
import { Delegado, DelegadoCreate, DelegadoService } from "../../../../servicios/formacion/delegado.service";
import { MdbPopconfirmService } from "mdb-angular-ui-kit/popconfirm";
import { ComponenteBase } from "../../../../util/componente-base";

@Component({
  selector: 'app-gestion-delegados',
  templateUrl: './gestion-delegados.component.html',
  styleUrls: ['./gestion-delegados.component.scss']
})
export class GestionDelegadosComponent extends ComponenteBase implements OnInit {

  estaAgregandoDelegado: boolean;
  existenCoincidencias: boolean;
  esUsuarioDelegado: boolean;
  usuarios: Usuario[];
  usuariosDelegados: Delegado[];
  buscarUsuarioForm: FormGroup;

  headers = [
    { key: 'nombreUsuario', label: 'Identificación' },
    { key: 'nombre', label: 'Nombres' },
    { key: 'apellido', label: 'Apellidos' },
  ]


  constructor(
    private mdbNotificationService: MdbNotificationService,
    private usuarioService: UsuarioService,
    private builder: FormBuilder,
    private delegadoService: DelegadoService,
    private popConfirmService: MdbPopconfirmService,
  ) {
    super(mdbNotificationService, popConfirmService);
    this.estaAgregandoDelegado = false;
    this.usuarios = [];
    this.buscarUsuarioForm = new FormGroup({});
    this.usuariosDelegados = [];
    this.existenCoincidencias = true;
    this.esUsuarioDelegado = false;
  }

  ngOnInit(): void {
    this.delegadoService.listar().subscribe({
      next: (delegados) => {
        this.usuariosDelegados = delegados;
        console.log('delegados: ', this.usuariosDelegados)
      },
      error: () => {
        Notificacion.notificar(this.mdbNotificationService, "Error al listar los delegados", TipoAlerta.ALERTA_ERROR)
      }
    })
    this.construirFormularioBusquedaUsuario();

  }

  private construirFormularioBusquedaUsuario() {

    this.buscarUsuarioForm = this.builder.group({
      identificacion: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          MyValidators.onlyNumbers(),
          MyValidators.validIdentification()
        ]
      ],
      apellidos: ['', [MyValidators.onlyLetters()]],
      nombres: ['', [MyValidators.onlyLetters()]],
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  private filtrarUsuariosDelegados(usuarios: Usuario[]) {
    this.usuariosDelegados.forEach((delegado) => {
      usuarios = usuarios.filter((usuario) => usuario.codUsuario !== delegado.cod_usuario);
    })
    return usuarios;
  }

  private eliminarDelegado(id: number) {

    this.delegadoService.eliminar(id).subscribe({
      next: () => {
        this.usuariosDelegados = this.usuariosDelegados.filter((delegadoFiltrado) => delegadoFiltrado.cod_usuario !== id);
        this.usuariosDelegados = [...this.usuariosDelegados];
        Notificacion.notificar(this.mdbNotificationService, "Delegado eliminado correctamente", TipoAlerta.ALERTA_OK);
      },
      error: (errorResponse: HttpErrorResponse) => {
        Notificacion.notificar(this.mdbNotificationService, 'No se pudo eliminar el delegado', TipoAlerta.ALERTA_ERROR);
        console.error(errorResponse);
      }
    })
  }

  get identificacionField() {
    return this.buscarUsuarioForm.get('identificacion');
  }

  get nombresField() {
    return this.buscarUsuarioForm.get('nombres');
  }

  get apellidosField() {
    return this.buscarUsuarioForm.get('apellidos');
  }

  get correoField() {
    return this.buscarUsuarioForm.get('correo');
  }

  buscarPorIdentificacion() {
    if (this.identificacionField?.invalid) return;

    this.usuarioService.buscarPorIdentificacion(this.identificacionField.value).subscribe(
      {
        next: (usuario) => {
          if (usuario === null) {
            this.usuarios = [];
            this.existenCoincidencias = false;
            this.esUsuarioDelegado = false;
            return;
          }

          // Revisar si el usuario ya es delegado
          const esUsuarioDelegado = this.usuariosDelegados.some((delegado) => delegado.cod_usuario === usuario.codUsuario);
          if (esUsuarioDelegado) {
            this.esUsuarioDelegado = true;
            this.usuarios = [];
            this.existenCoincidencias = true;
            return;
          }

          this.usuarios = [usuario];
          this.existenCoincidencias = true;
          this.esUsuarioDelegado = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificar(this.mdbNotificationService, errorResponse.error.mensaje, TipoAlerta.ALERTA_ERROR);
          this.existenCoincidencias = false;
          console.error(errorResponse);
        },
      });
  }

  buscarPorNombresApellidos() {
    if (this.nombresField?.invalid || this.apellidosField?.invalid) return;

    const data: UsuarioNombreApellido = {
      nombre: this.nombresField.value,
      apellido: this.apellidosField.value
    }
    this.usuarioService.buscarPorNombreApellido(data).subscribe(
      {
        next: (usuarios) => {
          console.log('usuarios: ', usuarios)
          const usuariosFiltrados = this.filtrarUsuariosDelegados(usuarios);

          if (usuariosFiltrados.length === 0) {
            this.usuarios = [];
            this.existenCoincidencias = false;
            this.esUsuarioDelegado = true;
            return;
          }

          this.usuarios = usuariosFiltrados;
          this.existenCoincidencias = true;
          this.esUsuarioDelegado = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificar(this.mdbNotificationService, errorResponse.error.mensaje, TipoAlerta.ALERTA_ERROR);
          this.existenCoincidencias = false;
          console.error(errorResponse);
        },
      });
  }

  buscarPorCorreo() {
    if (this.correoField?.invalid) return;

    this.usuarioService.buscarPorCorreo(this.correoField.value).subscribe(
      {
        next: (usuarios) => {
          const usuariosFiltrados = this.filtrarUsuariosDelegados(usuarios);

          if (usuariosFiltrados.length === 0) {
            this.usuarios = [];
            this.existenCoincidencias = false;
            this.esUsuarioDelegado = true;
            return;
          }

          this.usuarios = usuariosFiltrados;
          this.existenCoincidencias = true;
          this.esUsuarioDelegado = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificar(this.mdbNotificationService, errorResponse.error.mensaje, TipoAlerta.ALERTA_ERROR);
          this.existenCoincidencias = false;
          console.error(errorResponse);
        },
      }
    )
  }

  limpiarRegistros() {
    this.usuarios = [];
  }

  asignarComoDelegado(usuario: Usuario) {
    const delegado: DelegadoCreate = {
      codUsuario: usuario.codUsuario,
      codPeriodoAcademico: 190,
      estado: 'ACTIVO'
    }


    this.delegadoService.asignar(delegado).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter((usuarioFiltrado) => usuarioFiltrado.codUsuario !== usuario.codUsuario);
        this.usuarios = [...this.usuarios];
        this.delegadoService.listar().subscribe(
          delegados => this.usuariosDelegados = delegados
        )

        Notificacion.notificar(this.mdbNotificationService, "Delegado asignado correctamente", TipoAlerta.ALERTA_OK);
      },
      error: (errorResponse: HttpErrorResponse) => {
        Notificacion.notificar(this.mdbNotificationService, errorResponse.error.mensaje, TipoAlerta.ALERTA_ERROR);
        console.error(errorResponse);
      }
    })
  }


  onEliminarDelegado(event: Event, codigo: number) {
    super.mensajeConfirmacion = "¿Está seguro de eliminar el delegado?";
    super.openPopconfirm(event, this.eliminarDelegado.bind(this, codigo));

  }


}
