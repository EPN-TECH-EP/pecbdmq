import {Component, OnInit} from '@angular/core';
import {Curso} from "../../../../../modelo/flujos/especializacion/Curso";
import {CursosService} from "../../../../../servicios/especializacion/cursos.service";
import {CURSO_COMPLETO_ESTADO} from "../../../../../util/constantes/especializacion.const";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {Notificacion} from "../../../../../util/notificacion";
import {TipoAlerta} from "../../../../../enum/tipo-alerta";

@Component({
  selector: 'app-menu-calculo-nota-final',
  templateUrl: './menu-calculo-nota-final.component.html',
  styleUrls: ['./menu-calculo-nota-final.component.scss']
})
export class MenuCalculoNotaFinalComponent implements OnInit {

  cursos: Curso[]
  cursoSeleccionado: Curso;
  estaCargando: boolean;
  esVistaListaCursos: boolean;
  esNotasFinalesPorCurso: boolean;
  seGeneroLista:boolean;

  constructor(
    private cursosService: CursosService,
    private ns: MdbNotificationService
  ) {
    this.cursoSeleccionado = null;
    this.cursos = [];
    this.estaCargando = true;
    this.esVistaListaCursos = true;
    this.esNotasFinalesPorCurso = false;
    this.seGeneroLista = false;
  }

  ngOnInit(): void {
    this.cursosService.listarCursosPorEstado(CURSO_COMPLETO_ESTADO.REGISTRO_NOTAS).subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        this.estaCargando = false;
      },
      error: (err) => {
        console.log(err);
        this.estaCargando = false;
      }
    })
  }

  private mostrarNotificacion(mensaje: string, tipo: TipoAlerta) {
    Notificacion.notificar(this.ns, mensaje, tipo);
  }

  cursoSeleccionadoEvent($event: Curso) {
    if ($event) {
      this.cursoSeleccionado = $event;
      this.esVistaListaCursos = false;
      this.esNotasFinalesPorCurso = true;
    }
  }

  volverAListaCursos() {
    this.esVistaListaCursos = true;
    this.esNotasFinalesPorCurso = false;
    this.cursoSeleccionado = null;
  }

  generarListaAprobados() {
    this.cursosService.generarListaAprobados(this.cursoSeleccionado.codCursoEspecializacion).subscribe({
      next: (res) => {
        console.log(res);
        this.mostrarNotificacion("Se generó la lista de aprobados", TipoAlerta.ALERTA_OK);
        this.seGeneroLista = true;
      },
      error: (err) => {
        console.log(err);
        this.mostrarNotificacion("Ocurrió un error al generar la lista de aprobados", TipoAlerta.ALERTA_ERROR);
        this.estaCargando = false;
      }
    });
  }

  descargarListaAprobados() {

  }
}
