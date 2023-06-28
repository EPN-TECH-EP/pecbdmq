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
import { ComponenteBase } from "../../../../../util/componente-base";

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

  constructor(
    private materiasService: MateriasFormacionService,
    private materiasCatalogoService: MateriaService,
    private instructoresService: InstructorService,
    private paralelosService: ParaleloService,
    private aulasService: AulaService,
    private builder: FormBuilder,){
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
      // { key: 'nombreTipoContrato', label: 'Tipo de Contrato' },
    ]
    this.estaAgregandoMateria = false;
    this.estaEditandoMateria = false;
    this.codigoMateriaEditando = 0;
    this.materiaForm = new FormGroup({});

    this.construirFormularioMateria();

  }

  ngOnInit(): void {
    this.materiasCatalogoService.listar().subscribe({
      next: (materias) => {
        this.materiasCatalogo = materias;
        console.log(this.materiasCatalogo);
      },
      error: () => {
        console.error('error al listar materias');
      }
    });

    this.materiasService.listar().subscribe({
      next: (materias) => {
        this.materias = materias;
        console.log(this.materias);
      },
      error: () => {
        console.error('error al listar materias del catalogo');
      }
    })

    this.instructoresService.listar().subscribe({
      next: (instructores) => {
        this.instructores = instructores;
      },
      error: () => {
        console.error('error al listar instructores');
      }
    });

    this.paralelosService.getParalelos().subscribe({
      next: (paralelos) => {
        this.paralelos = paralelos;
      },
      error: () => {
        console.error('error al listar paralelos');
      }
    })

    this.aulasService.listar().subscribe({
      next: (aulas) => {
        console.log(aulas);
        this.aulas = aulas;
      },
      error: () => {
        console.error('error al listar aulas');
      }
    })
  }

  private construirFormularioMateria() {
    this.materiaForm = this.builder.group({
      codMateria      : [''],
      codCoordinador  : [''],
      codAsistentes   : [''],
      codInstructores: this.builder.array([]),
      codParalelo     : [''],
      codAula         : [''],
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
      codMateria: this.materiaForm.get('codMateria')?.value,
      codCoordinador: this.materiaForm.get('codCoordinador')?.value,
      codAsistente: [this.materiaForm.get('codAsistentes')?.value],
      codInstructor: this.materiaForm.get('codInstructores')?.value,
      codParalelo: this.materiaForm.get('codParalelo')?.value,
      codAula: this.materiaForm.get('codAula')?.value,
    }

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



  onEditarRegistroMateria(materia: Materia) {

  }

  onGuardarCambiosMateria() {

  }

  onCancelarEdicionMateria() {

  }



  onAgregarMateria() {
    console.log('agregando materia');
    console.log (this.materiaForm.value);
    this.crearMateria();
  }

  get codInstructoresFormArray() {
    return this.materiaForm.get('codInstructores') as FormArray;
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
