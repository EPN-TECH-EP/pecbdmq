import {Component, OnInit, ViewChild} from '@angular/core';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import {MdbPopconfirmRef, MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {Subscription} from 'rxjs';
import {Usuario} from 'src/app/modelo/admin/usuario';
import {AlertaComponent} from '../../../util/alerta/alerta.component';
import {MdbTableDirective} from 'mdb-angular-ui-kit/table';
import {UsuarioService} from '../../../../servicios/usuario.service';
import {HttpErrorResponse} from '@angular/common/http';
import {CustomHttpResponse} from 'src/app/modelo/admin/custom-http-response';
import {TipoAlerta} from 'src/app/enum/tipo-alerta';
import {Notificacion} from 'src/app/util/notificacion';
import {PopconfirmComponent} from '../../../util/popconfirm/popconfirm.component';
import {Router} from '@angular/router';
import {UsuarioNombreApellido} from '../../../../modelo/util/nombre-apellido';

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MyValidators} from "../../../../util/validators";
import {MdbModalRef, MdbModalService} from "mdb-angular-ui-kit/modal";
import {DatoPersonalComponent} from "../dato-personal/dato-personal.component";
import {UsuarioComponent} from "../usuario/usuario.component";

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  bucarUsuarioForm: FormGroup;
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  popconfirmRef: MdbPopconfirmRef<PopconfirmComponent> | null = null;
  showLoading: boolean = true;
  usuarios: Usuario[];
  usuarioFrm: Usuario = new Usuario();
  @ViewChild('table') table!: MdbTableDirective<Usuario>;
  editElementIndex = -1;
  addRow = false;
  headers = [
    {key: 'nombreUsuario', label: 'Identificación'},
    {key: 'nombre', label: 'Nombres'},
    {key: 'apellido', label: 'Apellidos'},
    {key: 'correo_personal', label: 'Correo personal'},
    {key: 'fechaRegistro', label: 'Fecha de registro'},
    {key: 'fechaUltimoLogin', label: 'Fecha último ingreso'},
    {key: 'active', label: 'Activo?'},
    {key: 'notLocked', label: 'Habilitado?'}
  ]
  mensajeConfirmacion: string;
  indexEliminar: number;
  currentRoute: string;
  editarDatoPersonalModalRef: MdbModalRef<DatoPersonalComponent> | null = null;
  crearUsuarioModalRef: MdbModalRef<UsuarioComponent> | null = null;

  constructor(
    private notificationService: MdbNotificationService,
    private usuarioService: UsuarioService,
    private popconfirmService: MdbPopconfirmService,
    private router: Router,
    private builder: FormBuilder,
    private modalService: MdbModalService
  ) {
    this.usuarios = [];
    this.bucarUsuarioForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.construirFormulario();
  }

  private construirFormulario() {
    this.bucarUsuarioForm = this.builder.group({
      identificacion: [
        '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(10), MyValidators.onlyNumbers()]
      ],
      nombres   : ['', [Validators.required, MyValidators.onlyLetters()]],
      apellidos : ['',[Validators.required, MyValidators.onlyLetters()]],
      correo    : ['', [Validators.required, Validators.email]],
    });
  }

  get identificacionField() {
    return this.bucarUsuarioForm.get('identificacion');
  }

  get nombresField() {
    return this.bucarUsuarioForm.get('nombres');
  }

  get apellidosField() {
    return this.bucarUsuarioForm.get('apellidos');
  }

  get correoField() {
    return this.bucarUsuarioForm.get('correo');
  }

  private notificacion(errorResponse: HttpErrorResponse) {

    let customError: CustomHttpResponse = errorResponse.error;
    let tipoAlerta: TipoAlerta = TipoAlerta.ALERTA_WARNING;

    let mensajeError = customError.mensaje;
    let codigoError = errorResponse.status;

    if (!mensajeError) {
      mensajeError = 'Error inesperado';
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }

    if (codigoError === 0) {
      mensajeError = 'Error de conexión al servidor';
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }

    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensajeError,
      tipoAlerta
    );
  }

  public notificacionOK(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_OK
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // funcionalidad

  confirmaActualizar(usuario: Usuario) {
    this.mensajeConfirmacion = '¿Actualizar los datos del usuario?';
  }

  confirmaEliminar(usuario: Usuario) {
    this.mensajeConfirmacion = '¿Eliminar el usuario? Esta acción es irreversible';
  }


  eliminar(usuario: Usuario) {
    this.subscriptions.push(
      this.usuarioService.eliminarUsuario(usuario.nombreUsuario).subscribe(
        {
          next: (response) => {
            this.showLoading = false;
            this.editElementIndex = -1;
            this.usuarios.splice(this.indexEliminar, 1);
            this.usuarios = [...this.usuarios];
            this.notificacionOK('Usuario eliminado con éxito');
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.notificacion(errorResponse);
            this.showLoading = false;
          },
        }
      )
    )
  }


  public errorNotification(mensaje: string) {
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensaje,
      TipoAlerta.ALERTA_ERROR
    );
  }

  actualizar(usuario: Usuario, formValue) {

    if (
      formValue.nombreUsuario === "" ||
      formValue.fechaRegistro === "" ||
      formValue.fechaUltimoLogin === "" ||
      formValue.active === undefined ||
      formValue.notLocked === undefined
    ) {
      this.errorNotification('Todos los campos deben estar llenos');
      return;
    }

    if (formValue.active === undefined) {
      usuario.active = false;
    } else {
      usuario.active = formValue.active;
    }

    if (formValue.notLocked === undefined) {
      usuario.notLocked = false;
    } else {
      usuario.notLocked = formValue.notLocked;
    }

    this.subscriptions.push(
      this.usuarioService.actualizarUsuario(usuario).subscribe(
        {
          next: (response) => {
            this.usuarios[this.editElementIndex] = response;
            this.showLoading = false;
            this.editElementIndex = -1;
            this.notificacionOK('Usuario actualizado con éxito');
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.notificacion(errorResponse);
            this.showLoading = false;
          },
        }
      )
    )
  }

  editar(index: number) {
    this.editElementIndex = index;
    this.usuarioFrm = {...this.usuarios[index]};
  }

  deshacer(index: number) {
    this.usuarioFrm = new Usuario();
    this.editElementIndex = -1;
  }

  // Funcionalidad de confirmación

  openPopconfirm(event: Event, index: number) {
    this.indexEliminar = index;
    const target = event.target as HTMLElement;

    console.log("mensaje de confirmacion: " + this.mensajeConfirmacion);

    this.popconfirmRef = this.popconfirmService.open(
      PopconfirmComponent,
      target,
      {popconfirmMode: 'modal', data: {mensaje: this.mensajeConfirmacion}}
    );

    this.popconfirmRef.onClose.subscribe((message: any) => {
      // cancela acción
      console.log("onClose() - " + message);
    });

    this.popconfirmRef.onConfirm.subscribe((message: any) => {
      //confirma acción
      console.log("onConfirm() - " + message);
      this.eliminar(this.usuarios[this.indexEliminar]);
    });

  }

  /*onCancel(){
    console.log('User cancelled action');
    // Handle the case where the user cancelled the action
    this.mostrarConfirmacion = false;
  }

  onConfirm(){
    console.log('User confirmed action');
    // Perform the action that the user confirmed
    this.mostrarConfirmacion = false;
  }*/


  buscarPorIdentificacion() {
    this.usuarioService.buscarPorIdentificacion(this.identificacionField.value).subscribe(
      {
        next: (usuario) => {
          this.usuarios[0] = usuario;
          this.usuarios.splice(1, this.usuarios.length);
          this.showLoading = false;
          this.usuarios = [...this.usuarios];
          console.log(this.usuarios);
        },
        error: (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
        },
      });
  }

  buscarPorNombresApellidos() {
    const data: UsuarioNombreApellido = {
      nombre: this.nombresField.value,
      apellido: this.apellidosField.value
    }
    this.usuarioService.buscarPorNombreApellido(data).subscribe(
      {
        next: (usuarios) => {
          this.usuarios = usuarios;
          this.showLoading = false;
          this.usuarios = [...this.usuarios];
        },
        error: (errorResponse: HttpErrorResponse) => {
          console.error(errorResponse);
        },
      });
  }

  buscarPorCorreo() {
    this.usuarioService.buscarPorCorreo(this.correoField.value).subscribe(
      {
        next: (usuarios) => {
          this.usuarios = usuarios;
          this.usuarios.splice(1, this.usuarios.length);
          this.showLoading = false;
          this.usuarios = [...this.usuarios];
        },
        error: (errorResponse: HttpErrorResponse) => {
          console.error(errorResponse);
        },
      }
    )
  }

  limpiarRegistros() {
    this.usuarios = [];
  }

  abrirModalEditarDatosPersonales(index: number) {
    const usuario = this.usuarios[index];
    this.editarDatoPersonalModalRef = this.modalService.open(DatoPersonalComponent, {
      data: {usuario: usuario },
      modalClass: 'modal-xl modal-dialog-centered',
    });
    this.editarDatoPersonalModalRef.onClose.subscribe((usuario: Usuario) => {
      if (usuario) {
        this.usuarios[index] = usuario;
        this.usuarios = [...this.usuarios];
      }
    });
  }

  abrirModalCrearUsuario() {
    this.crearUsuarioModalRef = this.modalService.open(UsuarioComponent, {
      modalClass: 'modal-xl modal-dialog-centered',
    });
    this.crearUsuarioModalRef.onClose.subscribe((usuario: Usuario) => {
      if (usuario) {
        this.usuarios.push(usuario);
        this.usuarios = [...this.usuarios];
      }
    });
  }

}
