import { Component, OnInit } from '@angular/core';
import { Curso } from "../../../../modelo/flujos/especializacion/Curso";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CursosService } from "../../../../servicios/especializacion/cursos.service";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { Notificacion } from "../../../../util/notificacion";
import { CURSO_COMPLETO_ESTADO } from "../../../../util/constantes/especializacon.const";
import { OPCIONES_DATEPICKER } from "../../../../util/constantes/opciones-datepicker.const";
import { EspConvocatoriaService } from "../../../../servicios/especializacion/esp-convocatoria.service";

@Component({
  selector: 'app-convocatoria',
  templateUrl: './convocatoria-especializacion.component.html',
  styleUrls: ['./convocatoria-especializacion.component.scss']
})
export class ConvocatoriaEspecializacionComponent implements OnInit {

  cursoSeleccionado: Curso;
  cursos: Curso[]

  estaCargando: boolean;
  esVistaListaCursos: boolean;
  esVistaConvocatoriaCurso: boolean;

  convocatoriaCursoForm: FormGroup;
  fechaActual: Date;

  protected readonly OPCIONES_DATEPICKER = OPCIONES_DATEPICKER;

  constructor(
    private cursosService: CursosService,
    private builder: FormBuilder,
    private ns: MdbNotificationService,
    private convocatoriaService: EspConvocatoriaService
  ) {
    this.cursoSeleccionado = null;
    this.estaCargando = true;
    this.esVistaListaCursos = true;
    this.esVistaConvocatoriaCurso = false;
    this.cursos = []
    this.fechaActual = new Date();
    this.convocatoriaCursoForm = new FormGroup({});
    this.construirFormulario();
  }

  ngOnInit(): void {
    this.cursosService.listarCursosPorEstado(CURSO_COMPLETO_ESTADO.CONVOCAORIA).subscribe({
      next: (cursos) => {
        this.cursos = cursos
        this.estaCargando = false;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  private notificar(mensaje: string, tipo: TipoAlerta) {
    Notificacion.notificar(this.ns, mensaje, tipo);
  }

  private construirFormulario() {
    this.convocatoriaCursoForm = this.builder.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });
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

  private crearConvocatoria() {
    this.convocatoriaService.crear().subscribe({
      next: (convocatoria) => {
        console.log(convocatoria);
        this.notificar('Convocatoria creada correctamente', TipoAlerta.ALERTA_OK);
      },
      error: (err) => {
        console.error(err);
        this.notificar('Error al crear la convocatoria', TipoAlerta.ALERTA_ERROR);
      }
    })
  }

  cursoSeleccionadoEvent($event: Curso) {
    this.cursoSeleccionado = $event;
    this.cargarInformacionCurso(this.cursoSeleccionado).then(
      () => {
        this.esVistaListaCursos = false;
        this.esVistaConvocatoriaCurso = true;
      }
    );
    console.log($event)
  }

  volverAListaCursos() {
    this.esVistaListaCursos = true;
    this.esVistaConvocatoriaCurso = false;
    this.cursoSeleccionado = null;
    this.convocatoriaCursoForm.reset();
  }

  get fechaInicioField() {
    return this.convocatoriaCursoForm.get('fechaInicio');
  }

  get fechaFinField() {
    return this.convocatoriaCursoForm.get('fechaFin');
  }

  onCrearConvocatoria() {
    if (this.convocatoriaCursoForm.invalid) {
      this.notificar('Debe ingresar todos los campos', TipoAlerta.ALERTA_WARNING);
      this.convocatoriaCursoForm.markAllAsTouched();
      return;
    }
    this.crearConvocatoria();
  }
}
