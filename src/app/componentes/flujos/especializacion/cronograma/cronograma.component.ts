import { Component, OnInit } from '@angular/core';
import { Curso } from "../../../../modelo/flujos/especializacion/Curso";
import { CursosService } from "../../../../servicios/especializacion/cursos.service";
import { CURSO_COMPLETO_ESTADO } from "../../../../util/constantes/especializacion.const";

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.scss']
})
export class CronogramaComponent implements OnInit {

  cursos: Curso[];
  cursosPorMes: { [key: string]: Curso[] };
  meses: string[];

  constructor(private cursosService: CursosService) {
    this.cursos = [];
    this.cursosPorMes = {};
    this.meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
  }

  ngOnInit(): void {

    this.cursosService.listarCursosPorEstado(CURSO_COMPLETO_ESTADO.TODOS).subscribe({
      next: response => {
        this.cursos = response;

        // Ordenar los cursos por fecha de inicio
        this.cursos.sort((a, b) => {
          if (a.fechaInicioCurso > b.fechaInicioCurso) {
            return 1;
          }
          if (a.fechaInicioCurso < b.fechaInicioCurso) {
            return -1;
          }
          return 0;
        });

        // Agrupar los cursos por mes
        this.cursos.forEach(curso => {
          const fecha = new Date(curso.fechaInicioCurso);
          const mes = fecha.getMonth(); // Obtener el número del mes (0-11)
          const mesKey = `${fecha.getFullYear()}-${mes + 1}`; // Formato: "YYYY-MM"

          if (!this.cursosPorMes[mesKey]) {
            this.cursosPorMes[mesKey] = [];
          }

          this.cursosPorMes[mesKey].push(curso);
          curso.fechaFinCurso = new Date(curso.fechaFinCurso);
        });

        console.log(this.cursosPorMes); // Verificar la estructura de datos
      }
    })
  }

  protected readonly Object = Object;
}
