import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TipoProcedenciaService} from '../../../../servicios/tipo-procedencia.service';
import {UnidadGestionService} from '../../../../servicios/unidad-gestion.service';
import {EstacionTrabajo, EstacionTrabajoService} from '../../../../servicios/estacion-trabajo.service';
import {Usuario} from '../../../../modelo/admin/usuario';
import {defaultInstructor, Instructor, InstructorRequest} from '../../../../modelo/flujos/instructor';
import {UnidadGestion} from '../../../../modelo/admin/unidad-gestion';
import {TipoProcedencia} from '../../../../modelo/admin/tipo-procedencia';
import {ProInstructorService} from '../../../../servicios/profesionalizacion/pro-instructor.service';
import {Notificacion} from '../../../../util/notificacion';
import {ComponenteBase} from '../../../../util/componente-base';
import {MdbNotificationService} from 'mdb-angular-ui-kit/notification';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';

@Component({
  selector: 'app-instructores',
  templateUrl: './pro-instructores.component.html',
  styleUrls: ['./pro-instructores.component.scss']
})
export class ProInstructoresComponent extends ComponenteBase implements OnInit {
  // TODO implement new endpoints
  constructor(
    private instructorService: ProInstructorService,
    private builder: FormBuilder,
    private tipoProcedenciaService: TipoProcedenciaService,
    private unidadGestionService: UnidadGestionService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
    private estacionTrabajoService: EstacionTrabajoService,
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);
    this.instructor = defaultInstructor;
    this.usuarios = [];
    this.instructores = [];
    this.unidadesGestion = [];
    this.tiposProcedencia = [];
    this.estacionesTrabajo = [];
    this.instructorForm = new FormGroup({});
    this.headers = [
      {key: 'cedula', label: 'Cédula'},
      {key: 'nombre', label: 'Instructor'},
      {key: 'gestion', label: 'Tipo procedencia'},
      {key: 'tipoproecdencia', label: 'Unidad de gestión'},
      {key: 'estacionTrabajo', label: 'Estación de Trabajo'},
    ]
    this.estaBuscandoUsuarios = false;
    this.estaAgregandoInstructor = false;
    this.estaEditandoInstructor = false;
    this.existenCoincidencias = true;
    this.codigoInstructorEditando = 0;
  }

  get codTipoProcedencia() {
    return this.instructorForm.get('codTipoProcedencia');
  }

  get codUnidadGestion() {
    return this.instructorForm.get('codUnidadGestion');
  }

  get codZona() {
    return this.instructorForm.get('codZona');
  }

  usuarios: Usuario[];
  instructor: Instructor;
  instructores: Instructor[];
  unidadesGestion: UnidadGestion[];
  estacionesTrabajo: EstacionTrabajo[];
  headers: { key: string, label: string }[];
  instructorForm: FormGroup;
  tiposProcedencia: TipoProcedencia[];

  estaBuscandoUsuarios: boolean;
  estaAgregandoInstructor: boolean;
  existenCoincidencias: boolean;
  estaEditandoInstructor: boolean;
  codigoInstructorEditando: number;

  protected readonly defaultInstructor = defaultInstructor;

  ngOnInit(): void {
    this.instructorService.listar().subscribe({
      next: (instructores) => {
        this.instructores = instructores;
      },
      error: () => {
        console.error('error al listar instructores');
      }
    })
    this.tipoProcedenciaService.listar().subscribe({
      next: (tiposProcedencia) => {
        this.tiposProcedencia = tiposProcedencia;
      },
      error: () => {
        console.error('error al listar tipos de procedencia');
      }
    })
    this.unidadGestionService.listar().subscribe({
      next: (unidadesGestion) => {
        this.unidadesGestion = unidadesGestion;
      },
      error: () => {
        console.error('error al listar unidades de gesti�n');
      }
    })
    this.estacionTrabajoService.listar().subscribe({
      next: (estacionesTrabajo) => {
        this.estacionesTrabajo = estacionesTrabajo;
      },
      error: () => {
        console.error('error al listar estaciones de trabajo');
      }
    })
    this.construirFormularioInstructor();
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

  onAgregarInstructor(usuario: Usuario) {
    this.instructor = {
      ...this.instructor,
      codDatosPersonales: usuario.codDatosPersonales.codDatosPersonales,
      cedula: usuario.nombreUsuario,
      nombre: usuario.codDatosPersonales.nombre,
      apellido: usuario.codDatosPersonales.apellido,
      correoPersonal: usuario.codDatosPersonales.correoPersonal,
    };
    this.estaAgregandoInstructor = true;
    this.estaBuscandoUsuarios = false;

  }

  onEditarRegistroInstructor(instructor: Instructor) {
    this.estaEditandoInstructor = true;
    this.instructor = instructor;
    this.codigoInstructorEditando = instructor.codInstructor;
    this.matchDatosInstructorEnFormulario();
  }

  onCancelarEdicionInstructor() {
    this.instructor = defaultInstructor;
    this.estaEditandoInstructor = false;
    this.codigoInstructorEditando = 0;
    this.instructorForm.reset();
  }

  onGuardarCambiosInstructor() {
    this.editarInstructor(this.instructor);
  }

  private construirFormularioInstructor() {
    this.instructorForm = this.builder.group({
      codTipoProcedencia: ['', Validators.required],
      codUnidadGestion: ['', Validators.required],
      codZona: ['', Validators.required],
      // codTipoContrato     : ['', Validators.required],
    })
  }

  private editarInstructor(instructor: Instructor) {
    instructor = {
      ...this.instructor,
      codTipoProcedencia: this.codTipoProcedencia?.value,
      codUnidadGestion: this.codUnidadGestion?.value,
      codEstacion: this.codZona?.value,
      // codTipoContrato: this.codTipoContrato?.value,
    }

    const instructorRequest: InstructorRequest = {
      codDatosPersonales: instructor.codDatosPersonales,
      codEstacion: instructor.codEstacion,
      codTipoContrato: 1,
      codTipoProcedencia: instructor.codTipoProcedencia,
      codUnidadGestion: instructor.codUnidadGestion,
    }
    const request = instructor.codInstructor === 0 ?
      this.instructorService.crear(instructorRequest) : this.instructorService.actualizar(instructorRequest, instructor.codInstructor);
    request.subscribe({
      next: (value) => {
        this.estaAgregandoInstructor = false;
        this.instructor = defaultInstructor;
        this.onCancelarEdicionInstructor();
        this.instructorService.listar().subscribe({
          next: (instructores) => {
            this.instructores = instructores;
          },
        })
        Notificacion.notificacionOK(
          this.notificationRef,
          this.notificationServiceLocal,
          "Registro guardado con exito!"
        );
      },
      error: (errorResponse) => {
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          errorResponse
        );
      },
    })
  }

  private matchDatosInstructorEnFormulario() {
    this.instructorForm.patchValue({
      codTipoProcedencia: this.instructor.codTipoProcedencia,
      codUnidadGestion: this.instructor.codUnidadGestion,
      codZona: this.instructor.codEstacion,
      codTipoContrato: this.instructor.codTipoContrato,
    })
  }

  confirmarEliminar(event: Event, instructor: Instructor): void {
    super.confirmaEliminarMensaje();
    super.openPopconfirm(event, () => this.onEliminarRegistroInstructor(instructor));
  }

  onEliminarRegistroInstructor(instructor: Instructor) {
    this.instructorService.eliminar(instructor.codInstructor).subscribe({
      next: () => {
        this.instructorForm.reset();
        this.instructorService.listar().subscribe({
          next: (instructores) => {
            this.instructores = instructores;
          }
        })
      }
    });
  }
}
