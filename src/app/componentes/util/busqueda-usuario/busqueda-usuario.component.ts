import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { Notificacion } from "../../../util/notificacion";
import { TipoAlerta } from "../../../enum/tipo-alerta";
import { UsuarioNombreApellido } from "../../../modelo/util/nombre-apellido";
import { MyValidators } from "../../../util/validators";
import { Usuario } from "../../../modelo/admin/usuario";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { UsuarioService } from "../../../servicios/usuario.service";

@Component({
  selector: 'app-busqueda-usuario',
  templateUrl: './busqueda-usuario.component.html',
  styleUrls: ['./busqueda-usuario.component.scss']
})
export class BusquedaUsuarioComponent implements OnInit {

  buscarUsuarioForm: FormGroup;

  @Output() usuariosEncontrados = new EventEmitter<Usuario[]>
  @Output() usuarioEncontrados = new EventEmitter<Usuario>

  constructor(
    private mdbNotificationService: MdbNotificationService,
    private usuarioService: UsuarioService,
    private builder: FormBuilder
  ) {
    this.buscarUsuarioForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.construirFormularioBusqueda();
  }

  private construirFormularioBusqueda() {
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

  buscarPorIdentificacion() {
    if (this.identificacionField?.invalid) return;

    this.usuarioService.buscarPorIdentificacion(this.identificacionField.value).subscribe(
      {
        next: (usuario) => {
          if (!usuario) {
            this.usuarioEncontrados.emit(null);
          }
          this.usuarioEncontrados.emit(usuario);

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
          if (usuarios.length > 0) {
            this.usuariosEncontrados.emit(usuarios);
          }
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
          if (usuarios.length > 0) {
            this.usuariosEncontrados.emit(usuarios);
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          Notificacion.notificar(this.mdbNotificationService, errorResponse.error.mensaje, TipoAlerta.ALERTA_ERROR);
          console.error(errorResponse);
        },
      }
    )
  }


}
