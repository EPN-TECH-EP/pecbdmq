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

  constructor(private estudiantesService: EstudianteService, private ns: MdbNotificationService) {
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
