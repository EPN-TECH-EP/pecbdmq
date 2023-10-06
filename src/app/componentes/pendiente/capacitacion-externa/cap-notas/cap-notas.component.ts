import { Component, OnInit } from '@angular/core';
import { NotaEspecializacion } from "../../../../modelo/flujos/especializacion/nota-especializacion";
import { EspInstructorResponse } from "../../../../modelo/flujos/instructor";
import { Usuario } from "../../../../modelo/admin/usuario";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Curso } from "../../../../modelo/flujos/especializacion/Curso";
import { EspRegistroNotasService } from "../../../../servicios/especializacion/esp-registro-notas.service";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { Router } from "@angular/router";
import { AutenticacionService } from "../../../../servicios/autenticacion.service";
import { CursosService } from "../../../../servicios/especializacion/cursos.service";
import { EspInstructorService } from "../../../../servicios/especializacion/esp-instructor.service";
import { Notificacion } from "../../../../util/notificacion";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { CURSO_COMPLETO_ESTADO } from "../../../../util/constantes/especializacion.const";
import { concatMap, map } from "rxjs/operators";
import { forkJoin } from "rxjs";
import * as XLSX from "xlsx";

@Component({
  selector: 'app-cap-notas',
  templateUrl: './cap-notas.component.html',
  styleUrls: ['./cap-notas.component.scss']
})
export class CapNotasComponent implements OnInit {

  notasEstudiantes: NotaEspecializacion[];
  instructor: EspInstructorResponse;
  usuario: Usuario = null

  estaEditandoNota: boolean;
  estudianteNotaEditando: NotaEspecializacion;
  codEstudianteNotaEditando: number;

  headers: { key: string, label: string, selected: boolean }[];

  notaPorEstudianteForm: FormGroup;
  esEstadoRegistroNotas: boolean;

  cursos: Curso[];
  cursoSeleccionado: Curso;
  esVistaCurso: boolean;
  esVistaListaCursos: boolean;
  estaCargando: boolean;

  listaCursoInstructor: EspInstructorResponse[];

  esInstructor: boolean;

  esVistaReportes: boolean;
  listado: any[];

  constructor(
    private registroNotasService: EspRegistroNotasService,
    private mdbNotificationService: MdbNotificationService,
    private router: Router,
    private builder: FormBuilder,
    private authService: AutenticacionService,
    private cursosService: CursosService,
    private instructorService: EspInstructorService,
  ) {
    this.estaEditandoNota = false;
    this.codEstudianteNotaEditando = 0;
    this.headers = [
      {key: 'codUnicoEstudiante', label: 'Código único', selected: true},
      {key: 'nombre', label: 'Estudiante', selected: true},
      {key: 'noFinal', label: 'Nota Final', selected: true},
      {key: 'notaSupletorio', label: 'Nota Final Supletorio', selected: true},
    ];
    this.notasEstudiantes = [];
    this.estudianteNotaEditando = null;
    this.notaPorEstudianteForm = new FormGroup({});
    this.esEstadoRegistroNotas = false;
    this.esInstructor = false;
    this.construirFormulario();

    this.authService.user$.subscribe({
      next: usuario => {
        this.usuario = usuario
      }
    })

    this.cursos = [];
    this.cursoSeleccionado = null;
    this.esVistaCurso = false;
    this.esVistaListaCursos = true;
    this.estaCargando = false;
    this.esVistaReportes = false;
  }

  ngOnInit(): void {
    this.consultarCursos();
  }

  private consultarCursos() {
    this.cursosService.listarCursosPorEstado(CURSO_COMPLETO_ESTADO.REGISTRO_NOTAS).subscribe(
      {
        next: cursos => {
          this.esInstructor = cursos.length > 0;
          this.cursos = cursos;
          console.log(cursos);
          this.estaCargando = true;
        }
      }
    )

  }

  cursoSeleccionadoEvent($event: Curso) {
    if ($event !== null) {
      this.cursoSeleccionado = $event;
      this.esVistaCurso = true;
      this.esVistaListaCursos = false;
      console.log($event);

    }

    this.registroNotasService.getByCurso(this.cursoSeleccionado.codCursoEspecializacion).subscribe({
      next: notas => {
        console.log(notas)
        this.notasEstudiantes = notas
        this.listado = notas
      },
      error: err => console.log(err)
    });
  }

  volverAListaCursos() {
    this.cursoSeleccionado = null;
    this.esVistaCurso = false;
    this.esVistaListaCursos = true;
    this.listado = [];
  }

  private construirFormulario() {
    this.notaPorEstudianteForm = this.builder.group({
      codNota: [''],
      notaFinal: [''],
      notaSupletorio: [''],
    });

    this.notaPorEstudianteForm.valueChanges.subscribe({
      next: value => {
        console.log(value);
      }
    });

  }

  editarNota(estudiante: NotaEspecializacion) {
    this.estaEditandoNota = true;
    this.codEstudianteNotaEditando = estudiante.codEstudiante;
    this.estudianteNotaEditando = estudiante;
    this.notaPorEstudianteForm.patchValue({
      codNota: estudiante.codNotaEspecializacion,
      notaFinal: estudiante.notaFinalEspecializacion,
      notaSupletorio: estudiante.notaSupletorio,
    });
  }

  onCancelarEdicionNota() {
    this.estaEditandoNota = false;
    this.codEstudianteNotaEditando = 0;
    this.notaPorEstudianteForm.reset();
  }

  onGuardarNota() {

    // verifica vacíos
    if ((this.notaPorEstudianteForm.get('notaFinal').value === '') || (this.notaPorEstudianteForm.get('notaFinal').value === null)) {
      Notificacion.notificar(this.mdbNotificationService, "Ingrese nota final", TipoAlerta.ALERTA_WARNING);
      return;
    }

    const notaPorEstudiante: NotaEspecializacion = {
      codNotaEspecializacion: this.notaPorEstudianteForm.get('codNota').value,
      notaFinalEspecializacion: this.notaPorEstudianteForm.get('notaFinal').value,
      notaSupletorio: this.notaPorEstudianteForm.get('notaSupletorio').value,
      cedula: this.estudianteNotaEditando.cedula,
      nombre: this.estudianteNotaEditando.nombre,
      apellido: this.estudianteNotaEditando.apellido,
      correoPersonal: this.estudianteNotaEditando.correoPersonal,
      correoInstitucional: this.estudianteNotaEditando.correoInstitucional,
      codigoUnicoEstudiante: this.estudianteNotaEditando.codigoUnicoEstudiante,
      codCursoEspecializacion: this.estudianteNotaEditando.codCursoEspecializacion,
      codEstudiante: this.estudianteNotaEditando.codEstudiante,
      codInscripcion: this.estudianteNotaEditando.codInscripcion,
      codInstructor: this.instructor.codInstructor,
    };

    this.registroNotasService.crear(notaPorEstudiante).subscribe({
      next: () => {
        Notificacion.notificar(this.mdbNotificationService, 'Nota registrada con éxito', TipoAlerta.ALERTA_OK);

        const indexEstudiante = this.notasEstudiantes.findIndex(estudiante => estudiante.codEstudiante === notaPorEstudiante.codEstudiante);
        this.notasEstudiantes[indexEstudiante] = notaPorEstudiante;
        this.notasEstudiantes = [...this.notasEstudiantes];

        this.onCancelarEdicionNota();
      },
      error: err => {
        Notificacion.notificar(this.mdbNotificationService, err.error.mensaje, TipoAlerta.ALERTA_ERROR);
      }
    });

  }

  onGenerarReportes() {
    this.esVistaReportes = !this.esVistaReportes;
  }

  descargarReporte() {
    let element = document.getElementById('registroNotasCursoTbl');

    // Clona la tabla
    let clonedTable = element.cloneNode(true) as HTMLTableElement;

    // Encuentra la columna "Acciones" y la elimina del clon
    clonedTable.querySelectorAll('th, td').forEach(cell => {
      if (cell.textContent.trim() === 'Acciones') {
        cell.remove();
      }
    });

    // Convertimos la tabla clonada a Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(clonedTable);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');
    XLSX.writeFile(book, `Reportes de registro de notas del curso de ${this.cursoSeleccionado.nombre}.xlsx`);
  }

  verRepositorioEstudiante(estudiante: NotaEspecializacion) {
    this.cursosService.estudiante = estudiante;
    this.cursosService.curso = this.cursoSeleccionado;
    this.router.navigate(['principal/especializacion/estudiante/repositorio']);
  }

}
