import {Component, OnInit} from '@angular/core';
import {
  MateriaPorInstructor,
} from "../../../../../servicios/formacion/registro-notas.service";
import {Notificacion} from "../../../../../util/notificacion";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {TipoAlerta} from "../../../../../enum/tipo-alerta";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AutenticacionService} from "../../../../../servicios/autenticacion.service";
import {concatMap, map} from "rxjs/operators";
import {forkJoin} from "rxjs";
import {ApelacionesService} from "../../../../../servicios/formacion/apelaciones.service";
import {EspInstructorResponse} from "../../../../../modelo/flujos/instructor";
import {Curso} from '../../../../../modelo/flujos/especializacion/Curso';
import {CURSO_COMPLETO_ESTADO} from 'src/app/util/constantes/especializacion.const';
import {CursosService} from '../../../../../servicios/especializacion/cursos.service';
import {EspInstructorService} from '../../../../../servicios/especializacion/esp-instructor.service';
import {Usuario} from '../../../../../modelo/admin/usuario';
import {EspRegistroNotasService} from 'src/app/servicios/especializacion/esp-registro-notas.service';
import {NotaEspecializacion} from 'src/app/modelo/flujos/especializacion/nota-especializacion';
import {ComponenteBase} from "../../../../../util/componente-base";
import {MdbPopconfirmService} from "mdb-angular-ui-kit/popconfirm";
import * as XLSX from "xlsx";

@Component({
  selector: 'app-registro-notas-especializacion',
  templateUrl: './registro-notas-especializacion.component.html',
  styleUrls: ['./registro-notas-especializacion.component.scss']
})
export class RegistroNotasEspecializacionComponent extends ComponenteBase implements OnInit {

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
    private popUpService: MdbPopconfirmService
  ) {
    super(mdbNotificationService, popUpService);
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
    this.instructorService.getInstructorById(this.usuario.codUsuario).subscribe({
      next: listaCursoInstructor => {

        console.log(listaCursoInstructor);

        if (listaCursoInstructor === null || listaCursoInstructor === undefined || listaCursoInstructor.length === 0) {
          Notificacion.notificar(this.mdbNotificationService, "No es usuario instructor", TipoAlerta.ALERTA_WARNING)
        } else {
          this.listaCursoInstructor = listaCursoInstructor;
          this.consultarCursos();
          this.esInstructor = true;
        }
      },
      error: () => {
        Notificacion.notificar(this.mdbNotificationService, "No es instructor de ningún curso", TipoAlerta.ALERTA_WARNING)
      }
    })
  }

  private consultarCursos() {
    this.cursosService.listarCursosPorInstructorAndEstado(this.usuario.codUsuario, CURSO_COMPLETO_ESTADO.REGISTRO_NOTAS).pipe(
      concatMap((cursos) => {
        const cursosWithTipoCurso$ = cursos.map((curso) => {
          return this.cursosService.getTipoCurso(curso.codCatalogoCursos).pipe(
            map((tipoCurso) => ({...curso, tipoCurso}))
          );
        });

        return forkJoin(cursosWithTipoCurso$);
      }),
      concatMap((cursosConTipo) => {
        const estadosObservables = cursosConTipo.map((curso) => {
          return this.cursosService.listarEstadosPorCurso(curso.tipoCurso.codTipoCurso).pipe(
            map((estados) => ({...curso, estados}))
          );
        });

        return forkJoin(estadosObservables);
      })
    ).subscribe({
      next: (cursosConEstados) => {
        this.cursos = cursosConEstados;
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


      // busca codInstructor en base al curso selecciondo de listaCursoInstructor
      this.listaCursoInstructor.forEach((curso) => {
          if (curso.codCursoEspecializacion === this.cursoSeleccionado.codCursoEspecializacion) {
            this.instructor = curso;
          }
        }
      );
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
      Notificacion.notificacion(this.notificationRef, this.mdbNotificationService, null, "Ingrese una nota final");
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
