import { Component, OnInit } from '@angular/core';
import { Estudiante, NotaDisciplina } from "../../../../../modelo/flujos/Estudiante";
import { MdbCheckboxChange } from "mdb-angular-ui-kit/checkbox";
import { EstudianteParaleloRequest, EstudianteService } from "../../../../../servicios/formacion/estudiante.service";
import { Paralelo } from "../../../../../modelo/admin/paralelo";
import { Notificacion } from "../../../../../util/notificacion";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { TipoAlerta } from "../../../../../enum/tipo-alerta";
import { RegistroNotasService } from "../../../../../servicios/formacion/registro-notas.service";
import { TipoBajaService } from "../../../../../servicios/tipo-baja.service";
import { TipoBaja } from "../../../../../modelo/admin/tipo_baja";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.scss']
})
export class EstudiantesComponent implements OnInit {

  estudiantes: Estudiante[];
  paralelosActivos: Paralelo[];
  tipoBajas: TipoBaja[];

  estudiantesPorParalelo: {paralelo: Paralelo, estudiantes: NotaDisciplina[]}[]

  codParalelo: number;
  codEstudianteBaja: number;
  codTipoDeBaja: FormControl;

  headers: {key: string, label: string}[];
  selections = new Set<Estudiante>();

  estaDandoDeBaja: boolean;

  constructor(
    private estudianteService: EstudianteService,
    private ns: MdbNotificationService,
    private registroNotasService: RegistroNotasService,
    private tipoBajaService: TipoBajaService,
  ) {
    this.tipoBajas = [];
    this.estudiantes = [];
    this.headers = [
      { key: 'codigo', label: 'Código Único' },
      { key: 'nombre', label: 'Estudiante' },
      { key: 'estado', label: 'Estado' },
    ]
    this.estaDandoDeBaja = false;
    this.codTipoDeBaja = new FormControl('');

  }

  ngOnInit(): void {

    this.tipoBajaService.getTiposBaja().subscribe({
      next: (tiposBaja) => {
        this.tipoBajas = tiposBaja;
      },
      error: (error) => {
        console.error(error);
      }
    })

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

    this.registroNotasService.listarEstudiantesNotaDisciplina().subscribe({
      next: (data) => {
        const paralelos = data.paralelos;
        this.estudiantesPorParalelo = paralelos.map(paralelo => {
          const estudiantes = data.estudiantesNotaDisciplina.filter(estudiante =>
            estudiante.codParalelo === paralelo.codParalelo);
          return { paralelo, estudiantes };
        });

      }
    })
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
    };

    this.asignarEstudiantes(estudiantesParaleloEstudiante);
  }

  private asignarEstudiantes(estudiantesParaleloEstudiante: EstudianteParaleloRequest) {
    this.estudianteService.asignarEstudianteMateriaParalelo(estudiantesParaleloEstudiante).subscribe({
      next: () => {
        this.mostrarNotificacion('Estudiantes asignados correctamente', TipoAlerta.ALERTA_OK);
        this.actualizarEstudiantes();
      },
      error: err => {
        this.mostrarNotificacion('Error al asignar estudiantes', TipoAlerta.ALERTA_ERROR);
      }
    });
  }

  private mostrarNotificacion(mensaje: string, tipo: TipoAlerta) {
    Notificacion.notificar(this.ns, mensaje, tipo);
  }

  private actualizarEstudiantes() {
    this.estudianteService.listar().subscribe({
      next: estudiantes => {
        this.estudiantes = estudiantes;
        if (this.estudiantes.length === 0) {
          this.registrarEstudiantesEnTablaNotas();
        }
      },
      error: err => {
        this.mostrarNotificacion('Error al obtener la lista de estudiantes', TipoAlerta.ALERTA_ERROR);
      }
    });
  }

  private registrarEstudiantesEnTablaNotas() {
    console.log('Registrando estudiantes en tabla notas');
    this.estudianteService.registrarEstudiantesEnTablaNotas().subscribe({
      next: () => {
        console.log('Estudiantes registrados en tabla notas');
      },
      error: err => {
        this.mostrarNotificacion('Error al registrar estudiantes en tabla de notas', TipoAlerta.ALERTA_ERROR);
      }
    });
  }

  darDeBajaEstudiante(estudiante: NotaDisciplina) {

  }

  onDarDeBaja(estudiante: NotaDisciplina) {
    this.estaDandoDeBaja = true;
    this.codEstudianteBaja = estudiante.codEstudiante;
  }

  onCancelarBaja() {
    this.codEstudianteBaja = 0;
    this.estaDandoDeBaja = false;
  }

  onGuardarBaja() {
  
  }
}
