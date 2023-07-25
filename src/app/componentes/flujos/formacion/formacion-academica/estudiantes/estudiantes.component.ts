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
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EMPTY, forkJoin, of, switchMap } from "rxjs";
import { FormacionService } from "../../../../../servicios/formacion/formacion.service";
import { catchError } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { FORMACION } from "../../../../../util/constantes/fomacion.const";

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.scss']
})
export class EstudiantesComponent implements OnInit {

  estudiantesSinParalelo: Estudiante[];
  estudiantesBaja: Estudiante[];
  paralelosActivos: Paralelo[];
  tipoBajas: TipoBaja[];
  documentoBaja: File;

  estudiantesPorParalelo: {paralelo: Paralelo, estudiantes: NotaDisciplina[]}[]

  codParalelo: number;
  codEstudianteBaja: number;
  bajaForm: FormGroup;

  headers: {key: string, label: string}[];
  headersBaja: {key: string, label: string}[];
  selections = new Set<Estudiante>();

  estaDandoDeBaja: boolean;
  esEstadoFormacionAcademica : boolean;


  constructor(
    private estudianteService: EstudianteService,
    private ns: MdbNotificationService,
    private registroNotasService: RegistroNotasService,
    private tipoBajaService: TipoBajaService,
    private builder: FormBuilder,
    private formacionService: FormacionService,
    private router: Router,
    private mdbNotificationService: MdbNotificationService
  ) {
    this.tipoBajas = [];
    this.estudiantesSinParalelo = [];
    this.estudiantesBaja = [];
    this.headers = [
      { key: 'codigo', label: 'Código Único' },
      { key: 'nombre', label: 'Estudiante' },
      { key: 'estado', label: 'Cédula' },
      { key: 'telefono', label: 'Teléfono' },
    ]
    this.headersBaja = [
      { key: 'codigo', label: 'Código Único' },
      { key: 'nombre', label: 'Estudiante' },
    ];
    this.estaDandoDeBaja = false;
    this.bajaForm = new FormGroup({});
    this.documentoBaja = null;
    this.codParalelo = 0;
    this.codEstudianteBaja = 0;
    this.esEstadoFormacionAcademica = false;
    this.construirFormularioBaja();

  }

  ngOnInit(): void {

    this.formacionService.getEstadoActual().pipe(
      catchError( (err: HttpErrorResponse)=>{
        console.log('Error:', err);
        return of(null)
      }),
      switchMap((estado) => {
        console.log(estado);
        if (!estado || estado.httpStatusCode !== 200) {
          Notificacion.notificar(this.mdbNotificationService, "No se pudo obtener el estado actual", TipoAlerta.ALERTA_WARNING);
          this.router.navigate(['/formacion/proceso']).then();
          return EMPTY;
        }

        if (estado.mensaje === FORMACION.estadoFormacionAcademica) {
          this.esEstadoFormacionAcademica = true;
          return forkJoin([
            this.tipoBajaService.getTiposBaja(),
            this.estudianteService.listarParalelosActivos(),
            this.estudianteService.listar(),
            this.estudianteService.listarEstudiantesBaja(),
            this.registroNotasService.listarEstudiantesNotaDisciplina()
          ]);
        }
        return EMPTY;
      })
    ).subscribe({
      next: ([tiposBaja, paralelos, estudiantes, estudiantesBaja, estudiantesNotaDisciplina]) => {
        // Handle the results of each observable here
        console.log('Tipos Baja:', tiposBaja);
        this.tipoBajas = tiposBaja;

        console.log('Paralelos:', paralelos);
        this.paralelosActivos = paralelos;

        console.log('Estudiantes:', estudiantes);
        this.estudiantesSinParalelo = estudiantes;

        console.log('Estudiantes Baja:', estudiantesBaja);
        this.estudiantesBaja = estudiantesBaja;

        console.log('Estudiantes Nota Disciplina:', estudiantesNotaDisciplina);
        const paralelosData = estudiantesNotaDisciplina.paralelos;
        this.estudiantesPorParalelo = paralelosData.map(paralelo => {
          const estudiantesData = estudiantesNotaDisciplina.estudiantesNotaDisciplina.filter(estudiante =>
            estudiante.codParalelo === paralelo.codParalelo);
          return { paralelo, estudiantes: estudiantesData };
        });

        this.filtrarEstudiantesBaja();
      },
      error: err => {
        console.log('Error:', err);
      }
    });

  }

  private construirFormularioBaja() {
    this.bajaForm = this.builder.group({
      codTipoBaja: ['', Validators.required],
      descripcionBaja: ['', Validators.required],
      archivos: ['', Validators.required]
    });
  }

  private asignarEstudiantes(estudiantesParaleloEstudiante: EstudianteParaleloRequest) {
    this.estudianteService.asignarEstudianteMateriaParalelo(estudiantesParaleloEstudiante).subscribe({
      next: () => {
        this.mostrarNotificacion('Estudiantes asignados correctamente', TipoAlerta.ALERTA_OK);
        this.actualizarEstudiantes();
      },
      error: err => {
        console.error(err)
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
        this.estudiantesSinParalelo = estudiantes;
        if (this.estudiantesSinParalelo.length === 0) {
          this.registrarEstudiantesEnTablaNotas();
        }
      },
      error: err => {
        console.error(err);
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
        console.error(err);
        this.mostrarNotificacion('Error al registrar estudiantes en tabla de notas', TipoAlerta.ALERTA_ERROR);
      }
    });
  }

  private filtrarEstudiantesBaja() {
    this.estudiantesPorParalelo = this.estudiantesPorParalelo.map(paralelo => {
      const estudiantes = paralelo.estudiantes.filter(
        estudiante => !this.estudiantesBaja.find(
          e => e.codEstudiante === estudiante.codEstudiante)
      );
      console.log('Estudiantes filtrados:', estudiantes);
      return { paralelo: paralelo.paralelo, estudiantes };
    });


  }


  allRowsSelected(): boolean {
    const selectionsLength = this.selections.size;
    const dataLength = this.estudiantesSinParalelo.length;
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
      this.estudiantesSinParalelo.forEach((row: Estudiante) => {
        this.select(row);
      });
    } else {
      this.estudiantesSinParalelo.forEach((row: Estudiante) => {
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

  onDarDeBaja(estudiante: NotaDisciplina) {
    this.estaDandoDeBaja = true;
    this.codEstudianteBaja = estudiante.codEstudiante;
  }

  onCancelarBaja() {
    this.codEstudianteBaja = 0;
    this.estaDandoDeBaja = false;
  }

  onConfirmarBaja(estudiante: NotaDisciplina) {
    const codTipoBaja = this.bajaForm.get('codTipoBaja')?.value;
    const descripcionBaja = this.bajaForm.get('descripcionBaja')?.value;

    if (!codTipoBaja || !descripcionBaja || !this.documentoBaja) {
      this.mostrarNotificacion('Debe llenar todos los campos', TipoAlerta.ALERTA_ERROR);
      return;
    }

    const bajaEstudiante = {
      codEstudiante: estudiante.codEstudiante,
      codTipoBaja: codTipoBaja,
      descripcionBaja: descripcionBaja,
    };

    console.log(bajaEstudiante);

    const formData = new FormData();
    formData.append('codEstudiante', bajaEstudiante.codEstudiante.toString());
    formData.append('codTipoBaja', bajaEstudiante.codTipoBaja.toString());
    formData.append('descripcionBaja', bajaEstudiante.descripcionBaja);
    formData.append('codSancion', '');
    formData.append('archivos', this.documentoBaja);

    this.estudianteService.darDeBajaEstudiante(formData).subscribe({
      next: () => {
        this.mostrarNotificacion('Estudiante dado de baja correctamente', TipoAlerta.ALERTA_OK);
        this.actualizarEstudiantes();
        this.onCancelarBaja();
      },
      error: err => {
        console.error(err);
        this.mostrarNotificacion('Error al dar de baja al estudiante', TipoAlerta.ALERTA_ERROR);
      }
    });

  }

  onFileChange($event: Event) {
    this.documentoBaja = ($event.target as HTMLInputElement).files![0];
    console.log(this.documentoBaja.name);
  }

}
