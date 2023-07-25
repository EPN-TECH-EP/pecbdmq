import { Component, OnInit } from '@angular/core';
import {
  EstudianteNota,
  EstudianteService,
  NotaMateriaPorEstudiante
} from "../../../../../servicios/formacion/estudiante.service";
import { Notificacion } from "../../../../../util/notificacion";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { TipoAlerta } from "../../../../../enum/tipo-alerta";
import { DatoPersonal } from "../../../../../modelo/admin/dato-personal";
import { FormacionService } from "../../../../../servicios/formacion/formacion.service";
import { Router } from "@angular/router";
import { catchError, map } from "rxjs/operators";
import { EMPTY, of, switchMap } from "rxjs";
import { FORMACION } from "../../../../../util/constantes/fomacion.const";

@Component({
  selector: 'app-notas-estudiantes',
  templateUrl: './notas-estudiantes.component.html',
  styleUrls: ['./notas-estudiantes.component.scss']
})
export class NotasEstudiantesComponent implements OnInit {

  notasEstudiantes: EstudianteNota[];
  headers: {key: string, label: string}[];
  headersNotasPorEstudiante: {key: string, label: string}[];
  notasMateriaPorEstudiante: NotaMateriaPorEstudiante[];

  estudianteSeleccionado: DatoPersonal;

  seGeneroListaDeAntiguedades: boolean = false;

  esVistaDeNotas: boolean = true;
  esVistaDeNotasPorEstudiante: boolean = false;

  esEstadoGraduacion: boolean = false;

  constructor(
    private estudiantesService: EstudianteService,
    private ns: MdbNotificationService,
    private formacionService: FormacionService,
    private router: Router,
  ) {
    this.headers = [
      { key: 'nombre', label: 'Estudiante' },
      { key: 'nombre', label: 'Correo electrónico' },
      { key: 'noFinal', label: 'Nota Final' },
      { key: 'notaDisciplinaria', label: 'Nota Final Disciplinaria' },
      { key: 'notaDisciplinaria', label: 'Promedio académico' },
    ];
    this.headersNotasPorEstudiante = [
      { key: 'nombre', label: 'Materia' },
      { key: 'nombre', label: 'Nota Final' },
      { key: 'noFinal', label: 'Nota Final Disciplinaria' },
      { key: 'notaDisciplinaria', label: 'Nota Supletorio' },
    ];
    this.estudianteSeleccionado = {} as DatoPersonal;
    this.notasMateriaPorEstudiante = [];
    this.notasEstudiantes = [];
  }

  ngOnInit(): void {
    this.formacionService.getEstadoActual().pipe(
      catchError((error) => {
        console.error(error);
        return of(null);
      }),
      switchMap((estado) => {
        if (!estado || estado.httpStatusCode !== 200) {
          Notificacion.notificar(this.ns, "No se pudo obtener el estado actual", TipoAlerta.ALERTA_WARNING);
          this.router.navigate(['/formacion/proceso']).then();
          return EMPTY;
        }

        if (estado.mensaje === FORMACION.estadoGraduacion) {
          this.esEstadoGraduacion = true;
          return this.estudiantesService.listarNotas().pipe(
            map((notas) => ({ estado, notas }))
          );
        }

        return EMPTY;
      })
    ).subscribe({
      next: ({ estado, notas }) => {
        if (this.esEstadoGraduacion) {
          this.notasEstudiantes = notas;
          console.log(this.notasEstudiantes);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  generarListaAntiguidades() {

    this.estudiantesService.generarListaDeAntiguedades().subscribe({
      next: () => {
        Notificacion.notificar(this.ns, "Lista de antigüedades generada correctamente", TipoAlerta.ALERTA_OK)
        this.seGeneroListaDeAntiguedades = true;
      },
      error: (error) => {
        console.error(error);
        Notificacion.notificar(this.ns, error.error.mensaje, TipoAlerta.ALERTA_ERROR)
      }
    })

  }

  verNotasPorMateria(estudiante: EstudianteNota) {
    console.log(estudiante);
    this.esVistaDeNotasPorEstudiante = true;
    this.esVistaDeNotas = false;
    this.estudianteSeleccionado = estudiante.datoPersonal;
    this.estudiantesService.listarNotasPorEstudiante(estudiante.notasFormacionFinal.codEstudiante).subscribe({
      next: (notas) => {
        this.notasMateriaPorEstudiante = notas;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  volverAVistaDeNotas() {
    this.esVistaDeNotasPorEstudiante = false;
    this.esVistaDeNotas = true;
  }

  descargarDocumentoAntiguedades() {

  }
}
