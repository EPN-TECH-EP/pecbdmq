import { Component, OnInit } from '@angular/core';
import { Estudiante, ESTUDIANTES } from "../../../../../modelo/flujos/Estudiante";
import { MdbCheckboxChange } from "mdb-angular-ui-kit/checkbox";
import { EstudianteParaleloRequest, EstudianteService } from "../../../../../servicios/formacion/estudiante.service";
import { Paralelo } from "../../../../../modelo/admin/paralelo";

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.scss']
})
export class EstudiantesComponent implements OnInit {

  estudiantes: Estudiante[];
  paralelosActivos: Paralelo[];

  codParalelo: number;

  headers: {key: string, label: string}[];
  selections = new Set<Estudiante>();

  constructor(
    private estudianteService: EstudianteService,
  ) {
    this.estudiantes = ESTUDIANTES;
    this.headers = [
      { key: 'codigo', label: 'Código Único' },
      { key: 'nombre', label: 'Estudiante' },
      { key: 'cedula', label: 'Cédula' },
      { key: 'telefono', label: 'Teléfono' },
      // { key: 'paralelo', label: 'Paralelo' },
    ]

  }

  ngOnInit(): void {
    this.estudianteService.listarParalelosActivos().subscribe({
      next: paralelos => {
        console.log(paralelos);
        this.paralelosActivos = paralelos;
      }
    })
    this.estudianteService.listar().subscribe({
      next: estudiantes => {
        this.estudiantes = estudiantes;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  allRowsSelected(): boolean {
    const selectionsLength = this.selections.size;
    const dataLength = this.estudiantes.length;
    return selectionsLength === dataLength;
  }

  toggleSelection(event: MdbCheckboxChange, value: Estudiante): void {
    if (event.checked) {
      this.select(value);
    } else {
      this.deselect(value);
    }
  }

  toggleAll(event: MdbCheckboxChange): void {
    if (event.checked) {
      this.estudiantes.forEach((row: Estudiante) => {
        this.select(row);
      });
    } else {
      this.estudiantes.forEach((row: Estudiante) => {
        this.deselect(row);
      });
    }
  }

  select(value: Estudiante): void {
    if (!this.selections.has(value)) {
      this.selections.add(value);
      console.log(this.selections);
    }
  }

  deselect(value: Estudiante): void {
    if (this.selections.has(value)) {
      this.selections.delete(value);
      console.log(this.selections);
    }
  }

  asignarEstudiantesAParalelo() {
    const estudiantesParaleloEstudiante: EstudianteParaleloRequest = {
      lista: Array.from(this.selections),
      codParalelo: this.codParalelo,
    }
    console.log(estudiantesParaleloEstudiante);
    this.estudianteService.asignarEstudianteMateriaParalelo(estudiantesParaleloEstudiante).subscribe({
      next: () => {
        console.log('Estudiantes asignados correctamente');
      }
    })

  }

}
