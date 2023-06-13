import { Component, OnInit } from '@angular/core';
import { Usuario } from "../../../modelo/admin/usuario";
import { AutenticacionService } from "../../../servicios/autenticacion.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OPCIONES_DATEPICKER } from "../../../util/constantes/opciones-datepicker.const";
import { MyValidators } from "../../../util/validators";
import { DatoPersonalService } from "../../../servicios/dato-personal.service";
import { UpdateDatoPersonalDto } from "../../../modelo/dto/dato-personal.dto";
import { DatoPersonal } from "../../../modelo/admin/dato-personal";
import { ImagenService } from "../../../servicios/imagen.service";
import { SafeResourceUrl } from "@angular/platform-browser";
import { catchError, tap } from "rxjs/operators";
import { EMPTY, throwError } from "rxjs";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  usuario: Usuario
  datosPersonales: UpdateDatoPersonalDto
  imagenPerfil: SafeResourceUrl
  formularioActualizarUsuario: FormGroup
  editando: boolean = false

  constructor(
    private autenticacionService: AutenticacionService,
    private formBuilder: FormBuilder,
    private datoPersonalService: DatoPersonalService,
    private imagenService: ImagenService
  ) {
    this.formularioActualizarUsuario = new FormGroup({})
    this.datosPersonales = {} as UpdateDatoPersonalDto
    this.constructorFormulario()
  }

  ngOnInit(): void {
    this.autenticacionService.user$.pipe(
      tap((usuario) => {
        this.usuario = usuario;
        this.imagenService.visualizar(usuario.codDatosPersonales.codDocumentoImagen).pipe(
          catchError(error => {
            console.error('Error al cargar la imagen de perfil:', error);
            this.imagenPerfil = "assets/img/avatars/avatar.jpg";
            return throwError(() => error);
          })
        ).subscribe((imagen) => {
          this.imagenPerfil = imagen;
        });
        this.datosPersonales = this.usuario.codDatosPersonales;
        this.usuario.codDatosPersonales.fechaNacimiento = new Date(this.usuario.codDatosPersonales.fechaNacimiento);
      }),
      catchError(() => {
        this.usuario = this.autenticacionService.obtieneUsuarioDeCache();
        this.imagenPerfil = "assets/img/avatars/avatar.jpg";
        return EMPTY;
      })
    ).subscribe()
  }

  private constructorFormulario() {
    this.formularioActualizarUsuario = this.formBuilder.group({
      nombre: ['', [Validators.minLength(3), Validators.maxLength(50), MyValidators.onlyLetters()]],
      apellido: ['', [Validators.minLength(3), Validators.maxLength(50), MyValidators.onlyLetters()]],
      correoPersonal: ['', Validators.email],
      telefono: ['', [Validators.minLength(10), Validators.maxLength(10), MyValidators.onlyNumbers()]],
      direccion: ['', [Validators.minLength(5), Validators.maxLength(100)]],
      fechaNacimiento: [''],
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
      nombre: this.nombreField.value,
      apellido: this.apellidoField.value,
      correoPersonal: this.correoPersonalField.value,
      numTelefCelular: this.telefonoField.value,
      codCantonResidencia: this.direccionField.value,
      fechaNacimiento: this.fechaNacimientoField.value,
    }

    this.datoPersonalService.update(this.datosPersonales, this.usuario.codDatosPersonales.codDatosPersonales)
      .subscribe(
        (datoPersonal: DatoPersonal) => {
          this.usuario.codDatosPersonales = datoPersonal
          this.autenticacionService.agregaUsuarioACache(this.usuario);
          this.usuario = this.autenticacionService.obtieneUsuarioDeCache();
        })
    this.editando = false;

  }

  onEditarPerfil() {
    this.formularioActualizarUsuario.patchValue({
      nombre: this.usuario.codDatosPersonales.nombre,
      apellido: this.usuario.codDatosPersonales.apellido,
      correoPersonal: this.usuario.codDatosPersonales.correoPersonal,
      telefono: this.usuario.codDatosPersonales.numTelefCelular,
      direccion: this.usuario.codDatosPersonales.codCantonResidencia,
      fechaNacimiento: this.usuario.codDatosPersonales.fechaNacimiento,
    });
  }

  cargarImagen(event: any) {
    const formData = new FormData();

    formData.append('archivo', event.target.files[0]);
    formData.append('codigo', this.usuario.codUsuario.toString());
    formData.append('proceso', 'Usuario')

    this.imagenService.cargar(formData).subscribe({
      next: (response) => {
        this.datosPersonales.codDocumentoImagen = response.body.codigo;
        this.imagenService.visualizar(response.body.codigo).subscribe(
          {
            next: (url) => {
              this.imagenPerfil = url
            },
            error: (error) => {
              console.log('Error al obtener la URL de la imagen: ', error)
            }
          });
      },
      error: (error) => {
        console.log('Error al cargar la imagen: ', error);
      }
    });

  }

  protected readonly opcionesDatePicker = OPCIONES_DATEPICKER;

}

