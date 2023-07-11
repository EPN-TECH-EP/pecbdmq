import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  MateriaAulaParaleloRequest, MateriaFormacion,
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
import { forkJoin } from "rxjs";
import { MdbSelectComponent } from "mdb-angular-ui-kit/select";
import { Notificacion } from "../../../../../util/notificacion";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { TipoAlerta } from "../../../../../enum/tipo-alerta";
import { MdbTabsComponent } from "mdb-angular-ui-kit/tabs";

@Component({
  selector: 'app-materias',
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.scss']
})
export class MateriasComponent implements OnInit, AfterViewInit {

  itemMateria: Materia
  codMateriaEditando: number;
  materiasFormacion: MateriaFormacionResponse;
  paralelos: Paralelo[];

  materiasCatalogo: Materia[];
  paralelosCatalogo: Paralelo[];
  aulasCatalogo: Aula[];
  instructoresCatalogo: Instructor[];

  headers: {key: string, label: string}[];

  paralelosFormGroup: FormGroup;
  materiaAulaFormGroup: FormGroup;

  paralelosSeleccionados: Paralelo[];
  materiasSeleccionadas: Materia[];

  // utils
  estaAgregandoMateria: boolean;
  estaEditandoMateria: boolean;
  error: boolean;
  loading: boolean;


  constructor(
    private mdbNotificationService: MdbNotificationService,
    private materiasService: MateriasFormacionService,
    private materiasCatalogoService: MateriaService,
    private instructoresService: InstructorService,
    private paralelosService: ParaleloService,
    private aulasService: AulaService,
    private builder: FormBuilder,) {
    this.itemMateria = {} as Materia;
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
  }

  ngOnInit(): void {

    const combinedObservables = forkJoin([
      this.instructoresService.listar(),
      this.paralelosService.getParalelos(),
      this.aulasService.listar(),
      this.materiasCatalogoService.listar()
    ]);

    combinedObservables.subscribe({
      next: ([instructores, paralelos, aulas, materiasCatalogo]) => {
        this.instructoresCatalogo = instructores;
        this.paralelosCatalogo = paralelos;
        this.aulasCatalogo = aulas;
        this.materiasCatalogo = materiasCatalogo;
      },
      error: () => {
        console.error('Error en una o más consultas');
        this.error = true;
      }
    });

    this.materiasService.listarMateriasParalelos().subscribe({
      next: (materiasFormacion) => {
        this.materiasFormacion = materiasFormacion;
        console.log('materiasFormacion', materiasFormacion);
      },
      error: () => {
        console.error('Error al listar las materias');
        this.error = true;
      }
    });
  }

  ngAfterViewInit(): void {
    this.tabs.setActiveTab(0);
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
      }
    });
  }

  private crearMateriaAula() {
    return this.builder.group({
      codMateria: [this.itemMateria.codMateria],
      codAula: ['', Validators.required],
    });
  }

  private filtrarMateriasSeleccionadas() {
    this.materiasCatalogo = this.materiasCatalogo.filter((materia) => {
      return !this.materiasSeleccionadas.includes(materia);
    });
  }

  get paralelosFormArray() {
    return this.paralelosFormGroup.get('paralelos') as FormArray;
  }

  get materiaAulaFormArray() {
    return this.materiaAulaFormGroup.get('materiaAula') as FormArray;
  }

  onEditarMateria(materia: MateriaFormacion) {
    this.estaEditandoMateria = true;
    this.codMateriaEditando = materia.codMateria;
  }

  agregarMateriaAula() {
    this.materiasSeleccionadas.push(this.itemMateria);
    this.filtrarMateriasSeleccionadas();
    this.materiaAulaFormArray.push(this.crearMateriaAula());
    this.itemMateria = {} as Materia;
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

  eliminarMateriaSeleccionada(materia: Materia) {
    const materias = this.materiaAulaFormArray;
    const index = materias.controls.findIndex((control: FormGroup) => control.get('codMateria')?.value === materia.codMateria);

    if (index !== -1) {
      materias.removeAt(index); // Desmarcar opción
      this.materiasSeleccionadas = this.materiasSeleccionadas.filter((m: Materia) => m.codMateria !== materia.codMateria);
      this.materiasCatalogo.push(materia);
    }

  }

  guardarMateriasAula() {

    const materiaAulaParalelo: MateriaAulaParaleloRequest = {
      materiasAulas: this.materiaAulaFormGroup?.value?.materiaAula,
      paralelos: this.paralelosSeleccionados
    }

    this.loading = true;

    this.materiasService.asignarMateriaParalelo(materiaAulaParalelo).subscribe({
      next: (res) => {
        if (res) {
          Notificacion.notificar(this.mdbNotificationService, 'Materias creadas correctamente', TipoAlerta.ALERTA_OK);
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

  @ViewChild('mdbSelectParalelos') selectElementParalelos: MdbSelectComponent;
  @ViewChild('tabs') tabs: MdbTabsComponent;

}
