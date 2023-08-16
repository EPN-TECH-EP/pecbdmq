import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProfesionalizacionBuscarService} from "../../servicios/profesionalizacion/profesionalizacion-buscar.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Notificacion} from "../../util/notificacion";
import {TipoAlerta} from "../../enum/tipo-alerta";
import {UsuarioNombreApellido} from "../../modelo/util/nombre-apellido";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {MyValidators} from "../../util/validators";

@Component({
  selector: 'app-generic-search',
  templateUrl: './generic-search.component.html',
  styleUrls: ['./generic-search.component.scss']
})
export class GenericSearchComponent<T extends ProfesionalizacionBuscarService<U, any>, U> implements OnInit {

  @Input() service: T;
  buscarUsuarioForm: FormGroup;

  @Output() usuariosEncontrados = new EventEmitter<U[]>()
  @Output() usuarioEncontrados = new EventEmitter<U>()

  constructor(
    private mdbNotificationService: MdbNotificationService,
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

    this.service.buscarPorIdentificacion(this.identificacionField.value).subscribe(
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
    this.service.buscarPorNombreApellido(data).subscribe(
      {
        next: (usuarios) => {
          if (usuarios != null) {
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

    this.service.buscarPorCorreo(this.correoField.value).subscribe(
      {
        next: (usuarios) => {
          if (usuarios.length != null) {
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
