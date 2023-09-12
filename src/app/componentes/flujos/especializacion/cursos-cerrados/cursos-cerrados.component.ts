import { Component, OnInit } from '@angular/core';
import { Curso } from "../../../../modelo/flujos/especializacion/Curso";
import { CursosService } from "../../../../servicios/especializacion/cursos.service";
import { CURSO_COMPLETO_ESTADO } from "../../../../util/constantes/especializacion.const";
import { Notificacion } from "../../../../util/notificacion";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";

@Component({
  selector: 'app-cursos-cerrados',
  templateUrl: './cursos-cerrados.component.html',
  styleUrls: ['./cursos-cerrados.component.scss']
})
export class CursosCerradosComponent implements OnInit {

  estaCargando: boolean
  esVistaListaCursos: boolean;
  esVistaCierreCurso: boolean;
  cursos: Curso[]
  cursoSeleccionado: Curso;

  constructor(
    private cursosService: CursosService,
    private ns: MdbNotificationService
  ) {
    this.estaCargando = true;
    this.esVistaListaCursos = true;
    this.esVistaCierreCurso = false;
    this.cursos = []
    this.cursoSeleccionado = null;
  }

  ngOnInit(): void {
    this.cursosService.listarCursosPorEstado(CURSO_COMPLETO_ESTADO.TODOS_CERRADOS).subscribe({
      next: (cursos) => {
        this.cursos = cursos
        this.estaCargando = false;
      }
    });
  }

  cursoSeleccionadoEvent($event: Curso) {
    if ($event) {
      this.cursoSeleccionado = $event;
      this.esVistaListaCursos = false;
      this.esVistaCierreCurso = true;
    }

  }

  volverAListaCursos() {
    this.esVistaListaCursos = true;
    this.esVistaCierreCurso = false;
    this.cursoSeleccionado = null;
  }

  reactivarCurso() {
    this.cursosService.reactivarCurso(this.cursoSeleccionado.codCursoEspecializacion).subscribe({
      next: () => {
        Notificacion.notificar(this.ns, "El curso se ha reactivado correctamente", TipoAlerta.ALERTA_OK)
        this.volverAListaCursos();
        this.ngOnInit();
      },
      error: (err) => {
        Notificacion.notificar(this.ns, "Error al reactivar el curso", TipoAlerta.ALERTA_ERROR)
        console.error(err);
      }
    });
  }
}
