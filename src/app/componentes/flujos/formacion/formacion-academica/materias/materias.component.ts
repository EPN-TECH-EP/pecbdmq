import { Component, OnInit } from '@angular/core';
import {
  MateriaFormacion, MateriaFormacionRequest,
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
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { forkJoin } from "rxjs";

@Component({
  selector: 'app-materias',
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.scss']
})
export class MateriasComponent implements OnInit {

  materias: MateriaFormacion[];
  materiasCatalogo: Materia[];
  instructores: Instructor[];
  aulas: Aula[];
  paralelos: Paralelo[];
  headers: {key: string, label: string}[];
  estaAgregandoMateria: boolean;
  estaEditandoMateria: boolean;
  codigoMateriaEditando: number;
  materiaForm: FormGroup;

  // utils
  loadInformation: boolean;
  error: boolean;

  constructor(
    private materiasService: MateriasFormacionService,
    private materiasCatalogoService: MateriaService,
    private instructoresService: InstructorService,
    private paralelosService: ParaleloService,
    private aulasService: AulaService,
    private builder: FormBuilder,) {
    this.materias = [];
    this.instructores = [];
    this.materiasCatalogo = [];
    this.aulas = [];
    this.paralelos = [];
    this.headers = [
      { key: 'materia', label: 'Materia' },
      { key: 'ejeMateria', label: 'Tipo Materia' },
      { key: 'coordinador', label: 'Coordinador' },
      { key: 'asistente', label: 'Asistente' },
      { key: 'instructor', label: 'Instructores' },
      { key: 'paralelos', label: 'Paralelo' },
      { key: 'aulas', label: 'Aula' },
    ]
    this.estaAgregandoMateria = false;
    this.estaEditandoMateria = false;
    this.codigoMateriaEditando = 0;
    this.materiaForm = new FormGroup({});
    this.loadInformation = false;
    this.error = false;

    this.construirFormularioMateria();

  }

  ngOnInit(): void {

    const combinedObservables = forkJoin([
      this.materiasService.listar(),
      this.instructoresService.listar(),
      this.paralelosService.getParalelos(),
      this.aulasService.listar(),
      this.materiasCatalogoService.listar()
    ]);

    combinedObservables.subscribe({
      next: ([materias, instructores, paralelos, aulas, materiasCatalogo]) => {
        this.materias = materias;
        this.instructores = instructores;
        this.paralelos = paralelos;
        this.aulas = aulas;
        this.materiasCatalogo = materiasCatalogo;
        this.loadInformation = true;
      },
      error: () => {
        console.error('Error en una o más consultas');
        this.error = true;
        this.loadInformation = true;
      }
    });
  }

  private construirFormularioMateria() {
    this.materiaForm = this.builder.group({
      codMateria: [''],
      codCoordinador: [''],
      codAsistentes: [''],
      codInstructores: this.builder.array([]),
      codParalelo: [''],
      codAula: [''],
    });

    this.materiaForm.get('codInstructores').valueChanges.subscribe({
      next: (value) => {
        console.log(value);
      }
    })

    this.materiaForm.valueChanges.subscribe({
      next: (value) => {
        console.log(value);
      }
    })
  }

  private crearMateria() {
    let materia: MateriaFormacionRequest = {
      codMateria    : this.materiaForm.get('codMateria')?.value,
      codCoordinador: this.materiaForm.get('codCoordinador')?.value,
      codAsistentes  : [this.materiaForm.get('codAsistentes')?.value],
      codInstructores : this.materiaForm.get('codInstructores')?.value,
      codParalelo   : this.materiaForm.get('codParalelo')?.value,
      codAula       : this.materiaForm.get('codAula')?.value,
    }
    console.log(materia);

    this.materiasService.crear(materia).subscribe({
      next: (res) => {
        if (res) {
          this.estaAgregandoMateria = false;
          this.materiasService.listar().subscribe({
            next: (materias) => {
              this.materias = materias;
            }
          })
        }
      },
      error: () => {
        console.error('error al agregar materia');
      }
    })
  }

  get codInstructores() {
    return this.materiaForm.get('codInstructores') as FormArray;
  }

  get codParalelo() {
    return this.materiaForm.get('codParalelo');
  }

  get codAula() {
    return this.materiaForm.get('codAula');
  }

  get codCoordinador() {
    return this.materiaForm.get('codCoordinador');
  }

  get codAsistentes() {
    return this.materiaForm.get('codAsistentes');
  }

  get codInstructoresFormArray() {
    return this.materiaForm.get('codInstructores') as FormArray;
  }

  onEditarRegistroMateria(materia: Materia) {

  }

  onGuardarCambiosMateria() {

  }

  onCancelarEdicionMateria() {

  }

  onAgregarMateria() {
    console.log('agregando materia');
    console.log(this.materiaForm.value);
    this.crearMateria();
  }

  toggleInstructorSelection(codigo: number) {
    const codInstructores = this.codInstructoresFormArray;
    const index = codInstructores.value.indexOf(codigo);

    if (index !== -1) {
      codInstructores.removeAt(index); // Desmarcar opción
    } else {
      codInstructores.push(this.builder.control(codigo)); // Marcar opción
    }
  }

}
