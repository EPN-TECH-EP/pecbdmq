import { Component, OnInit } from '@angular/core';
import { Usuario } from "../../../../../modelo/admin/usuario";
import { defaultEspInstructor, defaultInstructor, EspInstructorRequest, EspInstructorResponse, Instructor, InstructorRequest } from "../../../../../modelo/flujos/instructor";
import { InstructorService } from "../../../../../servicios/formacion/instructor.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TipoProcedenciaService } from "../../../../../servicios/tipo-procedencia.service";
import { TipoProcedencia } from "../../../../../modelo/admin/tipo-procedencia";
import { UnidadGestionService } from "../../../../../servicios/unidad-gestion.service";
import { UnidadGestion } from "../../../../../modelo/admin/unidad-gestion";
import { EstacionTrabajo, EstacionTrabajoService } from "../../../../../servicios/estacion-trabajo.service";
import { concatMap, forkJoin, map } from "rxjs";
import { ActivatedRoute } from '@angular/router';
import { CursosService } from 'src/app/servicios/especializacion/cursos.service';
import { CURSO_COMPLETO_ESTADO } from "../../../../../util/constantes/especializacon.const";
import { Curso } from '../../../../../modelo/flujos/especializacion/Curso';
import { EspInstructorService } from 'src/app/servicios/especializacion/esp-instructor.service';
import { TipoInstructor } from 'src/app/modelo/admin/tipo-instructor';
import { TipoInstructorService } from 'src/app/servicios/tipo-instructor.service';

@Component({
  selector: 'app-instructores-especializacion',
  templateUrl: './instructores-especializacion.component.html',
  styleUrls: ['./instructores-especializacion.component.scss']
})
export class InstructoresEspecializacionComponent implements OnInit {

  usuarios: Usuario[];
  instructor: EspInstructorResponse;
  instructores: EspInstructorResponse[];
  unidadesGestion: UnidadGestion[];
  estacionesTrabajo: EstacionTrabajo[];
  headers: {key: string, label: string}[];
  instructorForm: FormGroup;
  tiposProcedencia: TipoProcedencia[];
  tiposInstructor: TipoInstructor[];
  curso: Curso;

  estaBuscandoUsuarios: boolean;
  estaAgregandoInstructor: boolean;
  existenCoincidencias: boolean;
  estaEditandoInstructor: boolean;
  esInstructor: boolean;
  codigoInstructorEditando: number;

  cursos: Curso[];
  cursoSeleccionado: Curso;
  esVistaCurso: boolean;
  esVistaListaCursos: boolean;
  estaCargando: boolean;

  constructor(
    private route: ActivatedRoute,
    private cursosService: CursosService,
    private instructorService: EspInstructorService,
    private builder: FormBuilder,
    private tipoProcedenciaService: TipoProcedenciaService,
    private unidadGestionService: UnidadGestionService,
    private estacionTrabajoService: EstacionTrabajoService,
    private tipoInstructorService: TipoInstructorService,
  ) {
    this.instructor = defaultEspInstructor;
    this.usuarios = [];
    this.instructores = [];
    this.unidadesGestion = [];
    this.tiposProcedencia = [];
    this.estacionesTrabajo = [];
    this.tiposInstructor = [];
    this.instructorForm = new FormGroup({});
    this.headers = [
      { key: 'cedula', label: 'Cédula' },
      { key: 'nombre', label: 'Instructor' },
      { key: 'tipoProcedencia', label: 'Procedencia' },
      { key: 'unidadGestion', label: 'Unidad de Gestión' },
      { key: 'nombreZona', label: 'Zona' },
      { key: 'nombreTipoInstructor', label: 'Tipo Instructor' },
      // { key: 'nombreTipoContrato', label: 'Tipo de Contrato' },
    ]
    this.estaBuscandoUsuarios = false;
    this.estaAgregandoInstructor = false;
    this.estaEditandoInstructor = false;
    this.existenCoincidencias = true;
    this.codigoInstructorEditando = 0;
    this.esInstructor = false;

    this.cursos = [];
    this.cursoSeleccionado = null;
    this.esVistaCurso = false;
    this.esVistaListaCursos = true;
    this.estaCargando = false;
  }

  ngOnInit(): void {
    this.consultarCursos();
  }

  private consultarCursos() {
    this.cursosService.listarCursosPorEstado(CURSO_COMPLETO_ESTADO.CURSO).pipe(
      concatMap((cursos) => {
        const cursosWithTipoCurso$ = cursos.map((curso) => {
          return this.cursosService.getTipoCurso(curso.codCatalogoCursos).pipe(
            map((tipoCurso) => ({ ...curso, tipoCurso }))
          );
        });

        return forkJoin(cursosWithTipoCurso$);
      }),
      concatMap((cursosConTipo) => {
        const estadosObservables = cursosConTipo.map((curso) => {
          return this.cursosService.listarEstadosPorCurso(curso.tipoCurso.codTipoCurso).pipe(
            map((estados) => ({ ...curso, estados }))
          );
        });

        return forkJoin(estadosObservables);
      })
    ).subscribe({
      next: (cursosConEstados) => {
        this.cursos = cursosConEstados;
        this.estaCargando = true;
      },
      error: (error) => {
        console.error(error);
      }
    });

  }

  private construirFormularioInstructor() {
    this.instructorForm = this.builder.group({
      codTipoProcedencia: ['', Validators.required],
      codUnidadGestion: ['', Validators.required],
      codZona: ['', Validators.required],
      codTipoInstructor: ['', Validators.required],
      // codTipoContrato     : ['', Validators.required],
    })
  }

  cursoSeleccionadoEvent($event: Curso) {
    if ($event !== null) {
      this.cursoSeleccionado = $event;
      this.esVistaCurso = true;
      this.esVistaListaCursos = false;
      console.log($event);
    }

    const combinedObservables = forkJoin([
      this.instructorService.listarPorCurso(this.cursoSeleccionado.codCursoEspecializacion),
      this.tipoProcedenciaService.listar(),
      this.unidadGestionService.listar(),
      this.estacionTrabajoService.listar(),
      this.tipoInstructorService.listar(),
    ]);

    combinedObservables.subscribe({
      next: ([instructores, procedencias, unidades, estaciones, tiposInstructores]) => {
        this.instructores = instructores;
        this.tiposProcedencia = procedencias;
        this.unidadesGestion = unidades;
        this.estacionesTrabajo = estaciones;
        this.tiposInstructor = tiposInstructores;
      },
      error: () => {
        console.error('Error en una o más peticiones');
      }
    });

    this.construirFormularioInstructor();
  }

  volverAListaCursos() {
    this.cursoSeleccionado = null;
    this.esVistaCurso = false;
    this.esVistaListaCursos = true;
  }

  private editarInstructor(instructor: EspInstructorResponse) {
    instructor = {
      ...this.instructor,
      codTipoProcedencia: this.codTipoProcedencia?.value,
      codUnidadGestion: this.codUnidadGestion?.value,
      codEstacion: this.codZona?.value,
      codTipoInstructor: this.codTipoInstructor?.value,
    }

    const instructorRequest: EspInstructorRequest = {
      codInstructorCurso: instructor?.codInstructorCurso,
      codInstructor: instructor?.codInstructor,
      codDatosPersonales: instructor.codDatosPersonales,
      codEstacion: instructor.codEstacion,
      codTipoContrato: 1,
      codTipoProcedencia: instructor.codTipoProcedencia,
      codUnidadGestion: instructor.codUnidadGestion,
      codCursoEspecializacion: instructor.codCursoEspecializacion,
      codTipoInstructor: instructor.codTipoInstructor,
      descripcion: instructor.descripcion,
    }

    this.instructorService.crear(instructorRequest).subscribe({
      next: () => {
        this.estaEditandoInstructor = false;
        this.instructor = defaultEspInstructor;
        this.instructorForm.reset();
        this.instructorService.listarPorCurso(this.cursoSeleccionado.codCursoEspecializacion).subscribe({
          next: (instructores) => {
            this.instructores = instructores;
          }
        })
      }
    })
    console.log(instructor);

  }

  private matchDatosInstructorEnFormulario() {
    this.instructorForm.patchValue({
      codTipoProcedencia: this.instructor.codTipoProcedencia,
      codUnidadGestion: this.instructor.codUnidadGestion,
      codZona: this.instructor.codEstacion,
      codTipoContrato: this.instructor.codTipoContrato,
      codTipoInstructor: this.instructor.codTipoInstructor,
    })
  }

  private filtrarInstructores(usuario: Usuario[]) {
    this.instructores.forEach((instructor) => {
      this.usuarios = this.usuarios.filter((usuario) => {
        return usuario.nombreUsuario !== instructor.cedula;
      });
    });
    if (this.usuarios.length === 0) {
      this.usuarios = [];
      this.esInstructor = true;
    }
    this.esInstructor = false;
    console.log(this.usuarios);
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
    this.esInstructor = this.instructores.some((instructor) => {
      return instructor.cedula === usuario.nombreUsuario;
    });
    if (this.esInstructor) this.usuarios = [];

  }

  usuariosEncontrados(usuarios: Usuario[]) {
    console.log('usuarios encontrados: ', usuarios);
    if (usuarios.length === 0) {
      this.existenCoincidencias = false;
      this.usuarios = [];
      return;
    }
    this.usuarios = usuarios;
    this.existenCoincidencias = true;
    this.filtrarInstructores(usuarios);
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
      codCursoEspecializacion: this.cursoSeleccionado.codCursoEspecializacion,
      descripcion: '',
    };
    this.estaAgregandoInstructor = true;
    this.estaBuscandoUsuarios = false;

  }

  onEditarRegistroInstructor(instructor: EspInstructorResponse) {
    this.estaEditandoInstructor = true;
    this.instructor = instructor;
    this.codigoInstructorEditando = instructor.codInstructor;
    this.matchDatosInstructorEnFormulario();
  }

  onCancelarEdicionInstructor() {
    this.instructor = defaultEspInstructor;
    this.estaEditandoInstructor = false;
    this.codigoInstructorEditando = 0;
    this.instructorForm.reset();
  }

  onGuardarCambiosInstructor() {
    this.editarInstructor(this.instructor);
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

  get codTipoInstructor() {
    return this.instructorForm.get('codTipoInstructor');
  }

  protected readonly defaultEspInstructor = defaultEspInstructor;
}
