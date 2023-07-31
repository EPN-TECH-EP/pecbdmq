import { Component, OnInit } from '@angular/core';
import { CursosService } from "../../../../servicios/especializacion/cursos.service";
import { Curso } from "../../../../modelo/flujos/especializacion/Curso";
import { concatMap, forkJoin } from "rxjs";
import { map, mergeMap } from "rxjs/operators";

@Component({
  selector: 'app-estado-proceso-curso',
  templateUrl: './estado-proceso-curso.component.html',
  styleUrls: ['./estado-proceso-curso.component.scss']
})
export class EstadoProcesoCursoComponent implements OnInit {

  cursos: Curso[];
  cursoSeleccionado: Curso;

  esVistaCurso: boolean;
  esVistaListaCursos: boolean;
  estaCargando: boolean;

  constructor(
    private cursosService: CursosService,
  ) {
    this.cursos = [];
    this.cursoSeleccionado = null;
    this.esVistaCurso = false;
    this.esVistaListaCursos = true;
    this.estaCargando = false;
  }

  ngOnInit(): void {
    this.cursosService.listarCursosPorEstado('ABIERTOS').pipe(
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
        console.log(this.cursos);
        this.estaCargando = true;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  cursoSeleccionadoEvent($event: Curso) {
    if ($event !== null) {
      this.cursoSeleccionado = $event;
      this.esVistaCurso = true;
      this.esVistaListaCursos = false;
      console.log($event);
    }
  }

  volverAListaCursos() {
    this.cursoSeleccionado = null;
    this.esVistaCurso = false;
    this.esVistaListaCursos = true;
  }
}
