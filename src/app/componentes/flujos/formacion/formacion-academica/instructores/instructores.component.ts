import { Component, OnInit } from '@angular/core';
import { Usuario } from "../../../../../modelo/admin/usuario";
import { defaultInstructor, Instructor, InstructorRequest } from "../../../../../modelo/flujos/instructor";
import { InstructorService } from "../../../../../servicios/formacion/instructor.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TipoProcedenciaService } from "../../../../../servicios/tipo-procedencia.service";
import { TipoProcedencia } from "../../../../../modelo/admin/tipo-procedencia";
import { UnidadGestionService } from "../../../../../servicios/unidad-gestion.service";
import { UnidadGestion } from "../../../../../modelo/admin/unidad-gestion";
import { EstacionTrabajo, EstacionTrabajoService } from "../../../../../servicios/estacion-trabajo.service";
import { forkJoin } from "rxjs";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { TipoAlerta } from "../../../../../enum/tipo-alerta";
import { Notificacion } from "../../../../../util/notificacion";
import { CustomHttpResponse } from "../../../../../modelo/admin/custom-http-response";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-instructores',
  templateUrl: './instructores.component.html',
  styleUrls: ['./instructores.component.scss']
})
export class InstructoresComponent implements OnInit {

  usuarios: Usuario[];
  instructor: Instructor;
  instructores: Instructor[];
  unidadesGestion: UnidadGestion[];
  estacionesTrabajo: EstacionTrabajo[];
  headers: {key: string, label: string}[];
  instructorForm: FormGroup;
  tiposProcedencia: TipoProcedencia[];

  estaBuscandoUsuarios: boolean;
  estaAgregandoInstructor: boolean;
  existenCoincidencias: boolean;
  estaEditandoInstructor: boolean;
  esInstructor: boolean;
  codigoInstructorEditando: number;

  constructor(
    private instructorService: InstructorService,
    private builder: FormBuilder,
    private tipoProcedenciaService: TipoProcedenciaService,
    private unidadGestionService: UnidadGestionService,
    private estacionTrabajoService: EstacionTrabajoService,
    private ns: MdbNotificationService
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
    this.esInstructor = false;
  }

  ngOnInit(): void {

    const combinedObservables = forkJoin([
      this.instructorService.listar(),
      this.tipoProcedenciaService.listar(),
      this.unidadGestionService.listar(),
      this.estacionTrabajoService.listar(),
    ]);

    combinedObservables.subscribe({
      next: ([instructores, procedencias, unidades, estaciones]) => {
        this.instructores = instructores;
        this.tiposProcedencia = procedencias;
        this.unidadesGestion = unidades;
        this.estacionesTrabajo = estaciones;

        console.log(this.instructores);
      },
      error: () => {
        console.error('Error en una o más peticiones');
      }
    });

    this.construirFormularioInstructor();
  }

  private construirFormularioInstructor() {
    this.instructorForm = this.builder.group({
      codTipoProcedencia: ['', Validators.required],
      codUnidadGestion: ['', Validators.required],
      codZona: ['', Validators.required],
      // codTipoContrato     : ['', Validators.required],
    })
  }

  onAgregarInstructorService() {
    const instructor: InstructorRequest = {
      ...this.instructor,
      codTipoProcedencia: this.codTipoProcedencia?.value,
      codUnidadGestion: this.codUnidadGestion?.value,
      codEstacion: this.codZona?.value,
    }

    const instructorRequest: InstructorRequest = {
      codDatosPersonales: instructor.codDatosPersonales,
      codEstacion: instructor.codEstacion,
      codTipoContrato: 1,
      codTipoProcedencia: instructor.codTipoProcedencia,
      codUnidadGestion: instructor.codUnidadGestion,
    }
    this.instructorService.crear(instructorRequest).subscribe({
      next: () => {
        this.estaEditandoInstructor = false;
        this.estaAgregandoInstructor = false;
        this.instructor = defaultInstructor;
        this.instructorForm.reset();
        this.instructorService.listar().subscribe({
          next: (instructores) => {
            this.instructores = instructores;
            console.log(this.instructores);
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
    };
    this.estaAgregandoInstructor = true;
    this.estaBuscandoUsuarios = false;

  }

  onEditarRegistroInstructor(instructor: Instructor) {
    this.estaEditandoInstructor = true;
    this.instructor = instructor;
    this.codigoInstructorEditando = instructor.codInstructor;
    console.log(instructor);
    this.matchDatosInstructorEnFormulario();
  }

  onCancelarEdicionInstructor() {
    this.instructor = defaultInstructor;
    this.estaEditandoInstructor = false;
    this.codigoInstructorEditando = 0;
    this.instructorForm.reset();
  }

  onGuardarCambiosInstructor(instructor: Instructor) {


    this.instructor = {
      ...this.instructor,
      codUnidadGestion: this.codUnidadGestion?.value,
      codEstacion: this.codZona?.value,
      codTipoProcedencia: this.codTipoProcedencia?.value,
    }

    this.instructorService.actualizar(instructor.codInstructor, instructor).subscribe({
      next: () => {
        Notificacion.notificar(this.ns, 'Instructor actualizado correctamente', TipoAlerta.ALERTA_OK)
        this.instructores = this.instructores.map((instructor) => {
          if (instructor.codInstructor === this.codigoInstructorEditando) {
            return {
              ...instructor,
              codTipoProcedencia: this.codTipoProcedencia?.value,
              codUnidadGestion: this.codUnidadGestion?.value,
              codEstacion: this.codZona?.value,
            }
          }
          return instructor;
        });
        this.instructores = [...this.instructores];
        this.instructorForm.reset();
        this.codigoInstructorEditando = 0;
        this.estaEditandoInstructor = false;
      }
    });
  }

  onEliminarRegistroInstructor(inst: Instructor) {
    this.instructorService.eliminar(inst.codInstructor).subscribe({
      next: () => {
        Notificacion.notificar(this.ns, 'Instructor eliminado correctamente', TipoAlerta.ALERTA_OK)
        // filtrar instructores
        this.instructores = this.instructores.filter((instructor) => {
          return instructor.codInstructor !== inst.codInstructor;
        });
        this.instructores = [...this.instructores];
      },
      error: (res: HttpErrorResponse) => {
        Notificacion.notificar(this.ns, res.error.mensaje, TipoAlerta.ALERTA_ERROR)
      }
    });
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

  protected readonly defaultInstructor = defaultInstructor;


}
