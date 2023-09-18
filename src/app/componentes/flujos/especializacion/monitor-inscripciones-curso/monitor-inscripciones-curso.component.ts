import { Component, OnInit } from '@angular/core';
import {ComponenteBase} from "../../../../util/componente-base";
import {Curso} from "../../../../modelo/flujos/especializacion/Curso";
import {InscripcionDatosEspecializacion} from "../../../../modelo/flujos/especializacion/inscripcion-datos-esp";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {MdbPopconfirmService} from "mdb-angular-ui-kit/popconfirm";
import {CursosService} from "../../../../servicios/especializacion/cursos.service";
import {PruebaDetalleService} from "../../../../servicios/formacion/prueba-detalle.service";
import {EspInscripcionService} from "../../../../servicios/especializacion/esp-inscripcion.service";
import {Notificacion} from "../../../../util/notificacion";
import {CURSO_COMPLETO_ESTADO} from "../../../../util/constantes/especializacion.const";

@Component({
  selector: 'app-monitor-inscripciones-curso',
  templateUrl: './monitor-inscripciones-curso.component.html',
  styleUrls: ['./monitor-inscripciones-curso.component.scss']
})
export class MonitorInscripcionesCursoComponent extends ComponenteBase implements OnInit {

  // selección de curso
  cursos: Curso[];
  cursoSeleccionado: Curso;

  esVistaCurso: boolean;
  esVistaListaCursos: boolean;

  listaInscripcionesValidas: InscripcionDatosEspecializacion[];

  headers = [
    {
      key: 'idPostulante',
      label: 'ID',
    },
    {
      key: 'nombre',
      label: 'Nombre',
    },
    {
      key: 'cedula',
      label: 'Cédula',
    },
    {
      key: 'correoPersonal',
      label: 'Correo Personal',
    },
  ];

  constructor(private notificationServiceLocal: MdbNotificationService,
              private mdbPopconfirmServiceLocal: MdbPopconfirmService,
              private cursosService: CursosService,
              private espInscripcionService: EspInscripcionService,) {

    super(notificationServiceLocal, mdbPopconfirmServiceLocal);

    this.cursos = [];
    this.cursoSeleccionado = null;
    this.esVistaCurso = false;
    this.esVistaListaCursos = true;

    this.listaInscripcionesValidas = [];

    this.showLoading = false;
  }

  ngOnInit(): void {
    this.cargarListaCursos();
  }


  ////////////////////////////
  // Inscripciones válidos
  ////////////////////////////

  // cargar lista de Inscripciones válidas del servicio InscripcionesValidasService

  cargarInscripcionesValidas() {
    this.showLoading = true;
    this.subscriptions.push(
      this.espInscripcionService.obtenerInscritosTodoPorCurso(this.cursoSeleccionado.codCursoEspecializacion).subscribe({
        next: (inscripciones) => {
          this.listaInscripcionesValidas = inscripciones;
          this.listaInscripcionesValidas = [...this.listaInscripcionesValidas];

          this.showLoading = false;
        },
        error: (errorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
          this.showLoading = false;
        },
      })
    );
  }

  ////////////////////////////////////////////
  ///////// Lista y Selección de curso  //////
  ////////////////////////////////////////////

  cargarListaCursos() {
    this.subscriptions.push(
      this.cursosService.listarCursosPorEstado(CURSO_COMPLETO_ESTADO.TODOS).subscribe({
        next: (lista: Curso[]) => {
          this.cursos = lista;
          console.log('listaCursos', lista);
        },
        error: (errorResponse) => {
          Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, errorResponse);
        },
      })
    );
  }

  cursoSeleccionadoEvent($event: Curso) {
    if ($event !== null) {
      this.cursoSeleccionado = $event;
      this.esVistaCurso = true;
      this.esVistaListaCursos = false;

      this.cargarInformacionCurso(this.cursoSeleccionado);

      this.cargarInscripcionesValidas();
    }
  }

  volverAListaCursos() {
    this.cursoSeleccionado = null;
    this.esVistaCurso = false;
    this.esVistaListaCursos = true;
  }

  private async cargarInformacionCurso(curso: Curso) {
    await this.cursosService.getTipoCurso(curso.codCatalogoCursos).subscribe({
      next: (tipoCurso) => {
        this.cursoSeleccionado.tipoCurso = tipoCurso;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
