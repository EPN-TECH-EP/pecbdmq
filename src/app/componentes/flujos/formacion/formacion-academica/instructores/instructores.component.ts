import { Component, OnInit } from '@angular/core';
import { Usuario } from "../../../../../modelo/admin/usuario";
import { defaultInstructor, Instructor } from "../../../../../modelo/flujos/instructor";
import { InstructorService } from "../../../../../servicios/formacion/instructor.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TipoProcedenciaService } from "../../../../../servicios/tipo-procedencia.service";
import { TipoProcedencia } from "../../../../../modelo/admin/tipo-procedencia";
import { UnidadGestionService } from "../../../../../servicios/unidad-gestion.service";
import { UnidadGestion } from "../../../../../modelo/admin/unidad-gestion";
import { EstacionTrabajo, EstacionTrabajoService } from "../../../../../servicios/estacion-trabajo.service";

@Component({
  selector: 'app-instructores',
  templateUrl: './instructores.component.html',
  styleUrls: ['./instructores.component.scss']
})
export class InstructoresComponent implements OnInit {

  usuarios          : Usuario[];
  instructor        : Instructor;
  instructores      : Instructor[];
  unidadesGestion   : UnidadGestion[];
  estacionesTrabajo : EstacionTrabajo[];
  headers           : {key: string, label: string}[];
  instructorForm    : FormGroup;
  tiposProcedencia  : TipoProcedencia[];

  estaBuscandoUsuarios    : boolean;
  estaAgregandoInstructor : boolean;
  existenCoincidencias    : boolean;
  estaEditandoInstructor  : boolean;
  codigoInstructorEditando: number;

  constructor(
    private instructorService: InstructorService,
    private builder: FormBuilder,
    private tipoProcedenciaService: TipoProcedenciaService,
    private unidadGestionService: UnidadGestionService,
    private estacionTrabajoService: EstacionTrabajoService,
  ) {
    this.instructor = defaultInstructor;
    this.usuarios = [];
    this.instructores = [];
    this.unidadesGestion = [];
    this.tiposProcedencia = [];
    this.estacionesTrabajo = [];
    this.instructorForm = new FormGroup({});
    this.headers = [
      { key: 'cedula', label: 'Cédula' },
      { key: 'nombre', label: 'Instructor' },
      { key: 'tipoProcedencia', label: 'Procedencia' },
      { key: 'unidadGestion', label: 'Unidad de Gestión' },
      { key: 'nombreZona', label: 'Zona' },
      // { key: 'nombreTipoContrato', label: 'Tipo de Contrato' },
    ]
    this.estaBuscandoUsuarios = false;
    this.estaAgregandoInstructor = false;
    this.estaEditandoInstructor = false;
    this.existenCoincidencias = true;
    this.codigoInstructorEditando = 0;
  }

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
        console.error('error al listar unidades de gestión');
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
      console.log('no hay usuario');
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
      codTipoProcedencia  : ['', Validators.required],
      codUnidadGestion    : ['', Validators.required],
      codZona             : ['', Validators.required],
      // codTipoContrato     : ['', Validators.required],
    })
  }

  private editarInstructor(instructor: Instructor) {
    instructor = { ...this.instructor,
      codTipoProcedencia: this.codTipoProcedencia?.value,
      codUnidadGestion: this.codUnidadGestion?.value,
      codEstacion: this.codZona?.value,
      // codTipoContrato: this.codTipoContrato?.value,
    }

    console.log(instructor);

  }

  private matchDatosInstructorEnFormulario() {
    this.instructorForm.patchValue({
      codTipoProcedencia: this.instructor.codTipoProcedencia,
      codUnidadGestion: this.instructor.codUnidadGestion,
      codZona: this.instructor.codEstacion,
      codTipoContrato: this.instructor.codTipoContrato,
    })
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

  // get codTipoContrato() {
  //   return this.instructorForm.get('codTipoContrato');
  // }

  protected readonly defaultInstructor = defaultInstructor;
}
