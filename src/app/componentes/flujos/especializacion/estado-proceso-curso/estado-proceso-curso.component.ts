import { Component, OnInit } from '@angular/core';
import { CursosService } from "../../../../servicios/especializacion/cursos.service";
import { Curso } from "../../../../modelo/flujos/especializacion/Curso";
import { concatMap, forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { CURSO_COMPLETO_ESTADO } from "../../../../util/constantes/especializacion.const";
import { Notificacion } from "../../../../util/notificacion";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";

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
    private mdbNotificationService: MdbNotificationService,
  ) {
    this.cursos = [];
    this.cursoSeleccionado = null;
    this.esVistaCurso = false;
    this.esVistaListaCursos = true;
    this.estaCargando = false;
  }

  ngOnInit(): void {
    this.actualizarEstadoCurso();
  }

  private actualizarEstadoCurso() {
    this.cursosService.listarCursosPorEstado(CURSO_COMPLETO_ESTADO.ABIERTOS).pipe(
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
        this.ordenarEstadosPorCurso(this.cursos).then()
        this.estaCargando = true;
      },
      error: (error) => {
        console.error(error);
      }
    });

  }

  private notificar(mensaje: string, tipo: TipoAlerta) {
    Notificacion.notificar(this.mdbNotificationService, mensaje, tipo);
  }

  private async ordenarEstadosPorCurso(cursos: Curso[]) {
    const estadosActuales = await Promise.all(cursos.map(curso => this.cursosService.obtenerEstadoActual(curso.codCursoEspecializacion).toPromise()));

    cursos.forEach((curso, index) => {
      const estadoActualCurso = curso.estados.find(
        estado => estado.estadoCatalogo === estadosActuales[index].mensaje.toUpperCase()
      );

      curso.estados.sort((estadoA, estadoB) => estadoA.orden - estadoB.orden);

      curso.estados.forEach((estado, estadoIndex) => {
        if (estado === estadoActualCurso) {
          estado.estadoActual = 'actual';
        } else if (estadoIndex < curso.estados.indexOf(estadoActualCurso)) {
          estado.estadoActual = 'completado';
        } else {
          estado.estadoActual = 'siguiente';
        }
      });
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

  actualizarEstado(codigo: number) {
    console.log("Curso: ", this.cursoSeleccionado, "Codigo estado", codigo);
    this.cursosService.actualizarEstadoCurso(this.cursoSeleccionado.codCursoEspecializacion, codigo).subscribe({
      next: () => {
        this.notificar("Estado del curso actualizado correctamente", TipoAlerta.ALERTA_OK);
        this.actualizarEstadoCurso();
      },
      error: (error) => {
        console.error(error);
        this.notificar("Error al actualizar el estado del curso", TipoAlerta.ALERTA_ERROR);
      }
    });
  }

}
