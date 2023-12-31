import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import { MdbPopconfirmRef, MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/modelo/admin/usuario';
import { AlertaComponent } from '../../../util/alerta/alerta.component';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { UsuarioService } from '../../../../servicios/usuario.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { Notificacion } from 'src/app/util/notificacion';
import { PopconfirmComponent } from '../../../util/popconfirm/popconfirm.component';
import { Router } from '@angular/router';
import { UsuarioNombreApellido } from '../../../../modelo/util/nombre-apellido';

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MyValidators } from "../../../../util/validators";
import { MdbModalRef, MdbModalService } from "mdb-angular-ui-kit/modal";
import { DatoPersonalComponent } from "../dato-personal/dato-personal.component";
import { UsuarioComponent } from "../usuario/usuario.component";

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  buscarUsuarioForm: FormGroup;
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  popConfirmRef: MdbPopconfirmRef<PopconfirmComponent> | null = null;
  showLoading: boolean = true;
  usuarios: Usuario[];
  usuarioFrm: Usuario = new Usuario();
  @ViewChild('table') table!: MdbTableDirective<Usuario>;
  addRow = false;
  headers = [
    { key: 'nombreUsuario', label: 'Identificación' },
    { key: 'nombre', label: 'Nombres' },
    { key: 'apellido', label: 'Apellidos' },
    { key: 'correo_personal', label: 'Correo personal' },
    { key: 'correo_personal', label: 'Fecha de Registro' },
    { key: 'correo_personal', label: 'Último login' },
    { key: 'activo', label: 'Activo' },
    { key: 'bloqueado', label: 'No bloqueado' },
  ]
  mensajeConfirmacion: string;
  currentRoute: string;
  editarDatoPersonalModalRef: MdbModalRef<DatoPersonalComponent> | null = null;
  crearUsuarioModalRef: MdbModalRef<UsuarioComponent> | null = null;
  existenCoincidencias: boolean = true;

  estaEditando = false;
  codigoUsuarioEditando = 0;

  constructor(
    private mdbNotificationService: MdbNotificationService,
    private usuarioService: UsuarioService,
    private popconfirmService: MdbPopconfirmService,
    private router: Router,
    private builder: FormBuilder,
    private modalService: MdbModalService
  ) {
    this.usuarios = [];
    this.buscarUsuarioForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.construirFormulario();
  }

  private construirFormulario() {
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
      nombres: ['', [MyValidators.onlyLetters()]],
      apellidos: ['', [MyValidators.onlyLetters()]],
      correo: ['', [Validators.required, Validators.email]],
    });
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  confirmaEliminar() {
    this.mensajeConfirmacion = '¿Eliminar el usuario? Esta acción es irreversible';
  }

  eliminar(usuario: Usuario) {
    this.subscriptions.push(
      this.usuarioService.eliminarUsuario(usuario.nombreUsuario).subscribe(
        {
          next: () => {
            this.showLoading = false;
            const index = this.usuarios.findIndex(
              (usuarioItem) => usuarioItem.nombreUsuario === usuario.nombreUsuario
            );
            this.usuarios.splice(index, 1);
            this.usuarios = [...this.usuarios];
            Notificacion.notificar(this.mdbNotificationService, 'Usuario eliminado correctamente', TipoAlerta.ALERTA_OK);
          },
          error: (errorResponse: HttpErrorResponse) => {
            Notificacion.notificar(this.mdbNotificationService, errorResponse.error.mensaje, TipoAlerta.ALERTA_ERROR);
            this.showLoading = false;
          },
        }
      )
    )
  }

  actualizar(usuario: Usuario, formValue) {

    if (
      formValue.active === undefined ||
      formValue.notLocked === undefined
    ) {
      Notificacion.notificar(this.mdbNotificationService, 'Todos los campos son obligatorios', TipoAlerta.ALERTA_ERROR);
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
      this.usuarioService.actualizar(usuario).subscribe(
        {
          next: (response) => {
            const index = this.usuarios.findIndex(
              (usuarioItem) => usuarioItem.nombreUsuario === usuario.nombreUsuario
            );
            this.usuarios[index] = response;
            this.usuarios = [...this.usuarios];
            this.codigoUsuarioEditando = 0;
            this.estaEditando = false;
            this.showLoading = false;
            Notificacion.notificar(this.mdbNotificationService, 'Usuario actualizado correctamente', TipoAlerta.ALERTA_OK);
          },
          error: (errorResponse: HttpErrorResponse) => {
            Notificacion.notificar(this.mdbNotificationService, errorResponse.error.mensaje, TipoAlerta.ALERTA_ERROR);
            console.error("Error al actualizar usuario: " + errorResponse.error.mensaje);
            this.showLoading = false;
            this.estaEditando = false;

          },
        }
      )
    )
  }

  editRow(usuario: Usuario) {
    this.usuarioFrm = { ...usuario };
    this.codigoUsuarioEditando = usuario.codUsuario
  }

  undoRow() {
    this.estaEditando = false;
    this.usuarioFrm = new Usuario();
  }

  openPopconfirm(event: Event, codUsuario: number) {
    const target = event.target as HTMLElement;

    console.log("mensaje de confirmacion: " + this.mensajeConfirmacion);

    this.popConfirmRef = this.popconfirmService.open(
      PopconfirmComponent,
      target,
      { popconfirmMode: 'modal', data: { mensaje: this.mensajeConfirmacion } }
    );

    this.popConfirmRef.onClose.subscribe((message: any) => {
      console.log("onClose() - " + message);
    });

    this.popConfirmRef.onConfirm.subscribe((message: any) => {
      console.log("onConfirm() - " + message);
      const index = this.usuarios.findIndex((usuario) => usuario.codUsuario === codUsuario);
      this.eliminar(this.usuarios[index]);

    });

  }

  buscarPorIdentificacion() {
    if (this.identificacionField?.invalid) return;

    this.usuarioService.buscarPorIdentificacion(this.identificacionField.value).subscribe(
      {
        next: (usuario) => {
          if (usuario === null) {
            this.usuarios = [];
            this.existenCoincidencias = false;
            return;
          }
          this.usuarios[0] = usuario;
          this.usuarios.splice(1, this.usuarios.length);
          this.showLoading = false;
          this.usuarios = [...this.usuarios];
          this.existenCoincidencias = true;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificar(this.mdbNotificationService, errorResponse.error.mensaje, TipoAlerta.ALERTA_ERROR);
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
          if (usuarios.length === 0) {
            this.usuarios = [];
            this.existenCoincidencias = false;
            return;
          }
          this.usuarios = usuarios;
          this.showLoading = false;
          this.usuarios = [...this.usuarios];
          this.existenCoincidencias = true;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificar(this.mdbNotificationService, errorResponse.error.mensaje, TipoAlerta.ALERTA_ERROR);
          console.error(errorResponse);
        },
      });
  }

  buscarPorCorreo() {
    if (this.correoField?.invalid) return;

    this.usuarioService.buscarPorCorreo(this.correoField.value).subscribe(
      {
        next: (usuarios) => {
          if (usuarios.length === 0) {
            this.usuarios = [];
            this.existenCoincidencias = false;
            return;
          }
          this.usuarios = usuarios;
          this.showLoading = false;
          this.usuarios = [...this.usuarios];
          this.existenCoincidencias = true;
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificar(this.mdbNotificationService, errorResponse.error.mensaje, TipoAlerta.ALERTA_ERROR);
          console.error(errorResponse);
        },
      }
    )
  }

  limpiarRegistros() {
    this.usuarios = [];
  }

  abrirModalEditarDatosPersonales(usuario: Usuario) {
    this.editarDatoPersonalModalRef = this.modalService.open(DatoPersonalComponent, {
      data: { usuario: usuario },
      modalClass: 'modal-xl modal-dialog-centered',
    });
    this.editarDatoPersonalModalRef.onClose.subscribe((usuario: Usuario) => {
      if (usuario) {
        const index = this.usuarios.findIndex((usuarioItem) => usuarioItem.codUsuario === usuario.codUsuario);
        this.usuarios[index] = usuario;
        this.usuarios = [...this.usuarios];
        Notificacion.notificar(this.mdbNotificationService, 'Datos personales actualizados correctamente', TipoAlerta.ALERTA_OK);
      }
    });
  }

  abrirModalCrearUsuario() {
    this.crearUsuarioModalRef = this.modalService.open(UsuarioComponent, {
      modalClass: 'modal-xl modal-dialog-centered',
    });
    this.crearUsuarioModalRef.onClose.subscribe(
      (usuario: Usuario) => {
        if (usuario) {
          this.usuarios.push(usuario);
          this.usuarios = [...this.usuarios];
          Notificacion.notificar(this.mdbNotificationService, 'Usuario creado correctamente', TipoAlerta.ALERTA_OK);
        }
      },
    );
  }

}
