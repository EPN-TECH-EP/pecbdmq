import { Component, OnInit } from '@angular/core';
import { EstudianteNota, EstudianteService } from "../../../../../servicios/formacion/estudiante.service";

@Component({
  selector: 'app-notas-estudiantes',
  templateUrl: './notas-estudiantes.component.html',
  styleUrls: ['./notas-estudiantes.component.scss']
})
export class NotasEstudiantesComponent implements OnInit {
  notasEstudiantes: EstudianteNota[] = [];
  headers: {key: string, label: string}[];

  constructor(private estudiantesService: EstudianteService) {
    this.headers = [
      { key: 'nombre', label: 'Estudiante' },
      { key: 'nombre', label: 'Correo electrónico' },
      { key: 'noFinal', label: 'Nota Final' },
      { key: 'notaDisciplinaria', label: 'Nota Final Disciplinaria' },
      { key: 'notaDisciplinaria', label: 'Promedio académico' },
    ];
  }

  ngOnInit(): void {
    this.estudiantesService.listarNotas().subscribe({
        next: (notas) => {
          this.notasEstudiantes = notas;
          console.log(this.notasEstudiantes);
        },
        error: (error) => {
          console.error(error);
        }
      }
    )
  }

  generarListaAntiguidades() {

  }
}
