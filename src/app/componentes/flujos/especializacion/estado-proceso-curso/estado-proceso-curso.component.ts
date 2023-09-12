import { Component, OnInit } from '@angular/core';
import { CursosService } from "../../../../servicios/especializacion/cursos.service";
import { Curso } from "../../../../modelo/flujos/especializacion/Curso";
import { of, switchMap } from "rxjs";
import { catchError, tap } from "rxjs/operators";
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
  estadoActualCurso: string;
  esEstadoCierre: boolean;

  constructor(
    private cursosService: CursosService,
    private mdbNotificationService: MdbNotificationService,
  ) {
    this.cursos = [];
    this.cursoSeleccionado = null;
    this.esVistaCurso = false;
    this.esVistaListaCursos = true;
    this.estaCargando = true;
    this.estadoActualCurso = '';
    this.esEstadoCierre = false;
  }

  ngOnInit(): void {
    this.listarCursos();
  }

  private listarCursos() {
    this.cursosService.listarCursosPorEstado(CURSO_COMPLETO_ESTADO.ABIERTOS).subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        console.log(this.cursos);
        this.estaCargando = false;
      },
      error: (err) => {
        this.notificar('Error al listar los cursos', TipoAlerta.ALERTA_ERROR)
        console.error(err);
      }
    });
  }

  private obtenerDatosCurso(curso: Curso) {
    this.cursosService.getTipoCurso(curso.codCatalogoCursos).pipe(
      switchMap((tipoCurso) => {
        return this.cursosService.listarEstadosPorCurso(tipoCurso.codTipoCurso).pipe(
          tap((estados) => {
            this.cursoSeleccionado.tipoCurso = tipoCurso;
            console.log({ estados })
            this.cursoSeleccionado.estados = estados;
          }),
          catchError((err) => {
            this.notificar('Error al obtener los estados del curso', TipoAlerta.ALERTA_ERROR);
            console.error(err);
            throw err;
          })
        );
      })
    ).subscribe(() => {
      this.ordenarEstadosPorCurso(this.cursoSeleccionado);
    });
  }


  private notificar(mensaje: string, tipo: TipoAlerta) {
    Notificacion.notificar(this.mdbNotificationService, mensaje, tipo);
  }

  private ordenarEstadosPorCurso(curso: Curso) {
    const estadoActualCurso = curso.estados.find(
      estado => estado.estadoCatalogo === curso.estado
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
    this.estadoActualCurso = estadoActualCurso.estadoCatalogo;
    console.log({ estadoActualCurso });
  }


  cursoSeleccionadoEvent($event: Curso) {
    if ($event !== null) {
      this.cursoSeleccionado = $event;
      this.esVistaCurso = true;
      this.esVistaListaCursos = false;
      this.obtenerDatosCurso(this.cursoSeleccionado);
    }
  }

  volverAListaCursos() {
    this.cursoSeleccionado = null;
    this.esVistaCurso = false;
    this.esVistaListaCursos = true;
  }

  actualizarEstado($estado: any) {
    const codCurso = this.cursoSeleccionado.codCursoEspecializacion;

    this.cursosService.actualizarEstadoCurso(codCurso, $estado?.codigo).subscribe({
      next: () => {
        this.notificar("Estado del curso actualizado correctamente", TipoAlerta.ALERTA_OK);
        this.actualizarEstadoActualCurso(codCurso);
      },
      error: (error) => {
        console.error(error);
        this.notificar("Error al actualizar el estado del curso", TipoAlerta.ALERTA_ERROR);
      }
    });
  }

  private actualizarEstadoActualCurso(codCurso: number) {
    this.cursosService.comprobarMininoEstudiantes(codCurso)
      .pipe(switchMap((comprobacion) => {
          return this.cursosService.obtenerEstadoActual(codCurso)
            .pipe(catchError((error) => {
              console.error(error);
              return of(null);
            }));
        }),
        catchError((error) => {
          console.error(error);
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res !== null) {
          this.estadoActualCurso = res.mensaje;
          this.esEstadoCierre = this.estadoActualCurso === "SIN ESTADO";
          this.listarCursos();
        }
      });
  }

}
