import {Component, OnInit} from '@angular/core';
import {Usuario} from "../../../modelo/admin/usuario";
import {AutenticacionService} from "../../../servicios/autenticacion.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OPCIONES_DATEPICKER} from "../../../util/constantes/opciones-datepicker.const";
import {MyValidators} from "../../../util/validators";
import {DatoPersonalService} from "../../../servicios/dato-personal.service";
import {UpdateDatoPersonalDto} from "../../../modelo/dto/dato-personal.dto";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  usuario                     : Usuario
  datosPersonales             : UpdateDatoPersonalDto
  formularioActualizarUsuario : FormGroup
  editando                    : boolean = false

  constructor(
    private autenticacionService: AutenticacionService,
    private formBuilder: FormBuilder,
    private datoPersonalService: DatoPersonalService,
  ) {
    this.formularioActualizarUsuario = new FormGroup({})
    this.datosPersonales = {} as UpdateDatoPersonalDto
    this.constructorFormulario()
  }

  ngOnInit(): void {
    this.usuario = this.autenticacionService.obtieneUsuarioDeCache();
    this.usuario.codDatosPersonales.fecha_nacimiento = new Date(this.usuario.codDatosPersonales.fecha_nacimiento)
  }

  private constructorFormulario(): void {
    this.formularioActualizarUsuario = this.formBuilder.group({
      nombre          : ['', [Validators.minLength(3), Validators.maxLength(50), MyValidators.onlyLetters()]],
      apellido        : ['', [Validators.minLength(3), Validators.maxLength(50), MyValidators.onlyLetters()]],
      correoPersonal  : ['', Validators.email],
      telefono        : ['', [Validators.minLength(10), Validators.maxLength(10), MyValidators.onlyNumbers()]],
      direccion       : ['', [Validators.minLength(5), Validators.maxLength(100)]],
      fechaNacimiento : [''],
    })
    this.formularioActualizarUsuario.valueChanges.subscribe({
      next: value => {
        console.log(value)
      }
    })
  }

  get nombreField() {
    return this.formularioActualizarUsuario.get('nombre')
  }

  get apellidoField() {
    return this.formularioActualizarUsuario.get('apellido')
  }

  get correoPersonalField() {
    return this.formularioActualizarUsuario.get('correoPersonal')
  }

  get telefonoField() {
    return this.formularioActualizarUsuario.get('telefono')
  }

  get direccionField() {
    return this.formularioActualizarUsuario.get('direccion')
  }

  get fechaNacimientoField() {
    return this.formularioActualizarUsuario.get('fechaNacimiento')
  }

  actualizarDatosPersonales(): void {

    this.datosPersonales = {
      ...this.datosPersonales,
      nombre            : this.nombreField.value,
      apellido          : this.apellidoField.value,
      correo_personal   : this.correoPersonalField.value,
      num_telef_celular : this.telefonoField.value,
      canton_residencia : this.direccionField.value,
      fecha_nacimiento  : this.fechaNacimientoField.value,
    }

    this.datoPersonalService.update(this.datosPersonales, this.usuario.codDatosPersonales.cod_datos_personales)
      .subscribe( value => {
        console.log(value)
      })
  }

  editarPerfil() {
    this.formularioActualizarUsuario.patchValue({
      nombre          : this.usuario.codDatosPersonales.nombre,
      apellido        : this.usuario.codDatosPersonales.apellido,
      correoPersonal  : this.usuario.codDatosPersonales.correo_personal,
      telefono        : this.usuario.codDatosPersonales.num_telef_celular,
      direccion       : this.usuario.codDatosPersonales.canton_residencia,
      fechaNacimiento : this.usuario.codDatosPersonales.fecha_nacimiento,
    });
    console.log(this.formularioActualizarUsuario.value)
  }

  protected readonly opcionesDatePicker = OPCIONES_DATEPICKER;
}

