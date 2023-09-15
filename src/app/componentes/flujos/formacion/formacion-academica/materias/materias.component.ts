import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  MateriaAulaParaleloRequest,
  MateriaFormacion,
  MateriaFormacionRequest,
  MateriaFormacionResponse,
  MateriasFormacionService
} from "../../../../../servicios/formacion/materias-formacion.service";
import { Materia } from "../../../../../modelo/admin/materias";
import { MateriaService } from "../../../../../servicios/materia.service";
import { Instructor } from "../../../../../modelo/flujos/instructor";
import { InstructorService } from "../../../../../servicios/formacion/instructor.service";
import { Aula } from "../../../../../modelo/admin/aula";
import { Paralelo } from "../../../../../modelo/admin/paralelo";
import { ParaleloService } from "../../../../../servicios/paralelo.service";
import { AulaService } from "../../../../../servicios/aula.service";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EMPTY, forkJoin, of, switchMap } from "rxjs";
import { MdbSelectComponent } from "mdb-angular-ui-kit/select";
import { Notificacion } from "../../../../../util/notificacion";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { TipoAlerta } from "../../../../../enum/tipo-alerta";
import { MdbTabsComponent } from "mdb-angular-ui-kit/tabs";
import { catchError } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { FORMACION } from "../../../../../util/constantes/fomacion.const";
import { FormacionService } from "../../../../../servicios/formacion/formacion.service";
import { Router } from "@angular/router";
import { MdbStepperComponent } from "mdb-angular-ui-kit/stepper";

@Component({
  selector: 'app-materias',
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.scss']
})
export class MateriasComponent implements OnInit, AfterViewInit {

  materiasPorParalelo: {paralelo: Paralelo, materias: MateriaFormacion[]}[];

  itemMateria: Materia
  codMateriaEditando: number;
  materiaEditando: MateriaFormacionRequest;
  materiasFormacion: MateriaFormacionResponse;
  paralelos: Paralelo[];

  materiasCatalogo: Materia[];
  paralelosCatalogo: Paralelo[];
  aulasCatalogo: Aula[];
  instructoresCatalogo: Instructor[];

  headers: {key: string, label: string}[];

  paralelosFormGroup: FormGroup;
  materiaAulaFormGroup: FormGroup;
  materiasFormacionFormGroup: FormGroup;

  paralelosSeleccionados: Paralelo[];
  materiasSeleccionadas: Materia[];

  // utils
  estaAgregandoMateria: boolean;
  estaEditandoMateria: boolean;
  error: boolean;
  loading: boolean;
  totalPonderacion: number;
  esEstadoFormacionAcademica: boolean;

  constructor(
    private mdbNotificationService: MdbNotificationService,
    private materiasService: MateriasFormacionService,
    private materiasCatalogoService: MateriaService,
    private instructoresService: InstructorService,
    private paralelosService: ParaleloService,
    private aulasService: AulaService,
    private builder: FormBuilder,
    private formacionService: FormacionService,
    private router: Router
  ) {
    this.itemMateria = null;
    this.codMateriaEditando = 0;
    this.instructoresCatalogo = [];
    this.materiasCatalogo = [];
    this.aulasCatalogo = [];
    this.paralelosCatalogo = [];
    this.paralelosSeleccionados = [];
    this.materiasSeleccionadas = [];
    this.headers = [
      { key: 'materia', label: 'Materia' },
      { key: 'ejeMateria', label: 'Tipo' },
      { key: 'aulas', label: 'Aula' },
      { key: 'coordinador', label: 'Coordinador' },
      { key: 'asistente', label: 'Asistente' },
      { key: 'instructor', label: 'Instructores' },
    ]
    this.estaAgregandoMateria = false;
    this.estaEditandoMateria = false;
    this.error = false;
    this.loading = false;
    this.construirFormularios();
    this.paralelos = [];
    this.totalPonderacion = 0;
    this.esEstadoFormacionAcademica = false;
  }

  ngOnInit(): void {

    this.formacionService.getEstadoActual().pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        console.error(errorResponse);
        return of(null);
      }),
      switchMap((estado) => {
        console.log(estado);
        if (!estado || estado.httpStatusCode !== 200) {
          Notificacion.notificar(this.mdbNotificationService, "No se pudo obtener el estado actual", TipoAlerta.ALERTA_WARNING);
          this.router.navigate(['/formacion/proceso']).then();
          return EMPTY;
        }

        if (estado.mensaje === FORMACION.estadoFormacionAcademica) {
          this.esEstadoFormacionAcademica = true;
          return forkJoin([
            this.instructoresService.listar(),
            this.paralelosService.getParalelos(),
            this.aulasService.listar(),
            this.materiasCatalogoService.listar()
          ]);
        }
        // no es estado formacion academica
        return EMPTY;
      })
    ).subscribe({
      next: ([instructores, paralelos, aulas, materiasCatalogo]) => {
        this.instructoresCatalogo = instructores;
        this.paralelosCatalogo = paralelos;
        this.aulasCatalogo = aulas;
        this.materiasCatalogo = materiasCatalogo;
        this.actualizarMateriasFormacion();
      },
      error: () => {
        console.error('Error en una o más consultas');
        this.error = true;
      }
    });
  }

  ngAfterViewInit(): void {
  }

  private construirFormularios() {
    this.paralelosFormGroup = this.builder.group({
      paralelos: this.builder.array([])
    });

    this.paralelosFormGroup.valueChanges.subscribe({
      next: (value) => {
        console.log(value);
      }
    });

    this.materiaAulaFormGroup = this.builder.group({
      materiaAula: this.builder.array([])
    })

    this.materiaAulaFormGroup.valueChanges.subscribe({
      next: (value) => {
        console.log(value);
        this.totalPonderacion = this.materiaAulaFormArray.controls.reduce((acc, curr) => {
          return acc + curr.value.ponderacionMateria;
        }, 0)
        this.totalPonderacion = Number(this.totalPonderacion?.toFixed(2));
      }
    });

    this.materiasFormacionFormGroup = this.builder.group({
      codMateria: [''],
      codParalelo: [''],
      codAula: [''],
      codCoordinador: ['', Validators.required],
      codAsistentes: this.builder.array([]),
      codInstructores: this.builder.array([]),
    })

    this.materiasFormacionFormGroup.valueChanges.subscribe({
      next: (value) => {
        console.log(value);
      }
    });
  }

  private crearMateriaAula() {
    return this.builder.group({
      codMateria: [this.itemMateria?.codMateria],
      codAula: ['', Validators.required],
      ponderacionMateria: ['', Validators.required],
      notaMinimaSupletorio: ['', Validators.required],
    });
  }

  private filtrarMateriasSeleccionadas() {
    this.materiasCatalogo = this.materiasCatalogo.filter((materia) => {
      return !this.materiasSeleccionadas.includes(materia);
    });
  }

  private patchDatosMateriaFormacionFormGroup(materia: MateriaFormacionRequest) {

    if (this.asistentesFormArray.touched) {
      console.log('asistentes touched');
      const codAsistentesArray = this.asistentesFormArray;
      codAsistentesArray.clear();
    }

    if (this.instructoresFormArray.touched) {
      console.log('instructores touched');
      const codInstructoresArray = this.instructoresFormArray;
      codInstructoresArray.clear();
    }


    this.materiasFormacionFormGroup.patchValue({
      codMateria: materia.codMateria,
      codParalelo: materia.codParalelo,
      codAula: materia.codAula,
      codCoordinador: materia.codCoordinador,
    })
    console.log('form editando', this.materiasFormacionFormGroup.value);
  }

  private asignarCoordinadorTodosParalelos(materiaFormacion: MateriaFormacionRequest) {

    this.materiasPorParalelo.forEach((materiaPorParalelo) => {

      materiaPorParalelo.materias.forEach((materia) => {

        if (materia.codMateriaPeriodo === materiaFormacion.codMateria && materia.codParalelo !== materiaFormacion.codParalelo) {

          const materiaFormacionRequest: MateriaFormacionRequest = {
            codMateria: materia?.codMateriaPeriodo,
            codParalelo: materia?.codParalelo,
            codAula: materia?.codAula,
            codAsistentes: [],
            codCoordinador: materiaFormacion.codCoordinador,
            codInstructores: [],
          };

          this.materiasService.asignarInstructores(materiaFormacionRequest).subscribe({
            next: (res) => {
              if (res) {
                console.log('asignado coordinador a materia a todas las materias');
              }
            },
            error: () => {
              console.error('error al asignar coordinador a todas las materias');
              this.loading = false;
            }
          })
        }
      });

    });

  }

  private actualizarMateriasFormacion() {
    this.materiasService.listarMateriasParalelos().subscribe({
      next: (materiasFormacion) => {
        this.materiasFormacion = materiasFormacion;
        const paralelos = this.materiasFormacion.paralelos;

        this.materiasPorParalelo = paralelos.map(paralelo => {
          const materias = this.materiasFormacion.materias.filter(materia => materia.codParalelo === paralelo.codParalelo);
          return { paralelo, materias };
        });

        // ordeno las materias por alfabeticamente
        this.materiasPorParalelo.forEach(materiasPorParalelo => {
          materiasPorParalelo.materias.sort((a, b) => {
            if (a.nombre > b.nombre) {
              return 1;
            }
            if (a.nombre < b.nombre) {
              return -1;
            }
            return 0;
          });
        });

        console.log(this.materiasPorParalelo);

      },
      error: () => {
        console.error('Error al listar las materias');
        this.error = true;
      }
    });


  }

  get paralelosFormArray() {
    return this.paralelosFormGroup.get('paralelos') as FormArray;
  }

  get materiaAulaFormArray() {
    return this.materiaAulaFormGroup.get('materiaAula') as FormArray;
  }

  get asistentesFormArray() {
    return this.materiasFormacionFormGroup.get('codAsistentes') as FormArray;
  }

  get instructoresFormArray() {
    return this.materiasFormacionFormGroup.get('codInstructores') as FormArray;
  }

  onEditarMateria(materia: MateriaFormacion, paralelo: Paralelo) {
    this.materiaEditando = {
      codMateria: materia?.codMateriaPeriodo,
      codAula: materia?.codAula,
      codAsistentes: materia?.asistentes.map(a => a?.codInstructor),
      codCoordinador: materia?.coordinador?.codInstructor,
      codInstructores: materia?.instructores.map(i => i?.codInstructor),
      codParalelo: paralelo?.codParalelo,
    }
    this.patchDatosMateriaFormacionFormGroup(this.materiaEditando);
    this.estaEditandoMateria = true;
    this.codMateriaEditando = materia?.codMateriaPeriodo;
    console.log('codigo materia editando', this.codMateriaEditando);
  }

  onAgregarMateriaAula() {
    this.materiasSeleccionadas.push(this.itemMateria);
    this.filtrarMateriasSeleccionadas();
    this.materiaAulaFormArray.push(this.crearMateriaAula());
    this.itemMateria = null;
  }

  toggleParaleloSelection(paralelo: Paralelo) {
    const paralelos = this.paralelosFormArray;
    const index = paralelos.value.findIndex(p => p.codParalelo === paralelo.codParalelo);

    if (index !== -1) {
      paralelos.removeAt(index); // Desmarcar opción
      this.paralelosSeleccionados = this.paralelosSeleccionados.filter(p => p.codParalelo !== paralelo.codParalelo);
    } else {
      paralelos.push(this.builder.control(paralelo));
      this.paralelosSeleccionados.push(paralelo);
    }
    this.selectElementParalelos.writeValue(this.paralelosSeleccionados.map(p => p));

  }

  onEliminarMateriaSeleccionada(materia: Materia) {
    const materias = this.materiaAulaFormArray;
    const index = materias.controls.findIndex((control: FormGroup) => control.get('codMateria')?.value === materia.codMateria);

    if (index !== -1) {
      materias.removeAt(index); // Desmarcar opción
      this.materiasSeleccionadas = this.materiasSeleccionadas.filter((m: Materia) => m.codMateria !== materia.codMateria);
      this.materiasCatalogo.push(materia);
    }

  }

  onGuardarMateriasAula() {

    if (this.materiaAulaFormGroup.invalid) {
      Notificacion.notificar(this.mdbNotificationService, 'Llene todos los campos obligatorios', TipoAlerta.ALERTA_ERROR);
      return;
    }

    const materiaAulaParalelo: MateriaAulaParaleloRequest = {
      materiasAulas: this.materiaAulaFormGroup?.value?.materiaAula,
      paralelos: this.paralelosSeleccionados
    }

    this.loading = true;

    this.materiasService.asignarMateriaParalelo(materiaAulaParalelo).subscribe({
      next: (res) => {
        if (res) {
          Notificacion.notificar(this.mdbNotificationService, 'Materias creadas correctamente', TipoAlerta.ALERTA_OK);
          this.actualizarMateriasFormacion();
          this.paralelosSeleccionados = [];
          this.paralelosFormArray.clear();
          this.materiaAulaFormArray.clear();
          this.selectElementParalelos.writeValue([]);
          this.materiasSeleccionadas = [];
          this.stepper.resetAll();
          this.loading = false;
        }
      },
      error: () => {
        Notificacion.notificar(this.mdbNotificationService, 'Error al asignar materias', TipoAlerta.ALERTA_ERROR);
        console.error('error al asignar materia');
        this.loading = false;
      }
    })
  }

  onGuardarMateriaEditando() {

    const materiaFormacion: MateriaFormacionRequest = {
      codMateria: this.materiasFormacionFormGroup?.value?.codMateria,
      codParalelo: this.materiasFormacionFormGroup?.value?.codParalelo,
      codAula: this.materiasFormacionFormGroup?.value?.codAula,
      codAsistentes: this.materiasFormacionFormGroup?.value?.codAsistentes,
      codCoordinador: this.materiasFormacionFormGroup?.value?.codCoordinador,
      codInstructores: this.materiasFormacionFormGroup?.value?.codInstructores,
    };


    this.asignarCoordinadorTodosParalelos(materiaFormacion);

    this.loading = true;

    this.materiasService.asignarInstructores(materiaFormacion).subscribe({
      next: (res) => {
        if (res) {
          Notificacion.notificar(this.mdbNotificationService, 'Materia actualizada correctamente', TipoAlerta.ALERTA_OK);
          this.onCancelarEdicionMateria()
          this.actualizarMateriasFormacion();
          this.loading = false;
          this.materiasFormacionFormGroup.reset();
        }
      },
      error: () => {
        Notificacion.notificar(this.mdbNotificationService, 'Error al asignar materia', TipoAlerta.ALERTA_ERROR);
        console.error('error al asignar materia');
        this.loading = false;
      }
    });

  }

  onCancelarEdicionMateria() {
    this.estaEditandoMateria = false;
    this.codMateriaEditando = 0;
    this.materiaEditando = null;
    this.materiasFormacionFormGroup.reset();
    this.asistentesFormArray.clear();
    this.instructoresFormArray.clear();
  }

  toggleAsistentesSeleccionados(codigo: number) {
    const codAsistentes = this.asistentesFormArray;
    const index = codAsistentes.value.indexOf(codigo);

    if (index !== -1) {
      codAsistentes.removeAt(index);
    } else {
      codAsistentes.push(this.builder.control(codigo));
    }

  }

  toggleInstructoresSeleccionados(codInstructor: number) {
    const codInstructores = this.instructoresFormArray;
    const index = codInstructores.value.indexOf(codInstructor);

    if (index !== -1) {
      console.log('desmarcar');
      codInstructores.removeAt(index);
    } else {
      console.log('marcar');
      codInstructores.push(this.builder.control(codInstructor)); // Marcar opción
    }

  }

  @ViewChild('mdbSelectParalelos') selectElementParalelos: MdbSelectComponent;
  @ViewChild('stepper') stepper: MdbStepperComponent;

  getColorClass() {
    return this.totalPonderacion === 1 ? 'text-success' : 'text-danger';
  }

}
