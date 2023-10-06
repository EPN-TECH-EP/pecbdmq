import { Component, OnInit } from '@angular/core';
import { Usuario } from "../../../../modelo/admin/usuario";
import { Curso } from "../../../../modelo/flujos/especializacion/Curso";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CursosService } from "../../../../servicios/especializacion/cursos.service";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { MdbPopconfirmService } from "mdb-angular-ui-kit/popconfirm";
import { AutenticacionService } from "../../../../servicios/autenticacion.service";
import { ArchivoService } from "../../../../servicios/archivo.service";
import { Notificacion } from "../../../../util/notificacion";
import { CURSO_COMPLETO_ESTADO } from "../../../../util/constantes/especializacion.const";
import { TipoAlerta } from "../../../../enum/tipo-alerta";

@Component({
  selector: 'app-cap-validacion',
  templateUrl: './cap-validacion.component.html',
  styleUrls: ['./cap-validacion.component.scss']
})
export class CapValidacionComponent implements OnInit {

  usuario: Usuario;
  cursoSeleccionado: Curso;
  cursos: Curso[]
  estaCargando: boolean;
  esVistaListaCursos: boolean;
  esVistaValidacionCurso: boolean;
  aprobarCursoForm: FormGroup;
  showLoading: boolean;

  constructor(
    private cursosService: CursosService,
    private builder: FormBuilder,
    private notificationServiceLocal: MdbNotificationService,
    private mdbPopconfirmService: MdbPopconfirmService,
    private auth: AutenticacionService,
    private archivoService: ArchivoService) {


    this.cursoSeleccionado = null;
    this.usuario = null
    this.estaCargando = true;
    this.esVistaListaCursos = true;
    this.esVistaValidacionCurso = false;
    this.aprobarCursoForm = new FormGroup({});
    this.cursos = [];
    this.construirFormulario();
    this.showLoading = false;
  }

  ngOnInit(): void {
    this.auth.user$.subscribe({
      next: (usuario) => {
        this.usuario = usuario;
      }
    });
    this.listarCursos();
  }

  private construirFormulario() {
    this.aprobarCursoForm = this.builder.group({
      aprobado: ['', Validators.required],
      observaciones: ['']
    });
    this.aprobarCursoForm.controls['aprobado'].valueChanges.subscribe({
      next: (aprobado: boolean) => {
        if (!aprobado) {
          this.aprobarCursoForm.controls['observaciones'].setValidators([Validators.required]);
        } else {
          this.aprobarCursoForm.controls['observaciones'].clearValidators();
        }
        this.aprobarCursoForm.controls['observaciones'].updateValueAndValidity();
      }
    });
  }

  private async cargarInformacionCurso(curso: Curso) {
    await this.cursosService.getTipoCurso(curso.codCatalogoCursos).subscribe({
      next: (tipoCurso) => {
        this.cursoSeleccionado.tipoCurso = tipoCurso;
      },
      error: (err) => {
        console.error(err);
        Notificacion.notificar(this.notificationServiceLocal, 'Hubo un error al obtener el tipo de curso', TipoAlerta.ALERTA_ERROR);
      }
    });
  }

  private listarCursos() {
    this.cursosService.listarCursosPorEstado(CURSO_COMPLETO_ESTADO.VALIDACION_CURSO).subscribe({
      next: (cursos) => {
        this.cursos = cursos
        this.estaCargando = false;
      },
      error: (err) => {
        console.error(err);
        Notificacion.notificar(this.notificationServiceLocal, 'Hubo un error al obtener los cursos', TipoAlerta.ALERTA_ERROR);
      }
    });
  }

  private aprobarCurso() {

    this.showLoading = true;

    this.cursosService.aprobar(
      this.aprobarCursoForm.controls['aprobado'].value,
      this.aprobarCursoForm.controls['observaciones'].value,
      this.usuario.codUsuario,
      this.cursoSeleccionado.codCursoEspecializacion,
    ).subscribe({
      next: () => {
        this.notificar('Curso validado correctamente', TipoAlerta.ALERTA_OK);
        this.volverAListaCursos();
        this.listarCursos();

        this.showLoading = false;

      },
      error: (err) => {
        this.notificar('Hubo un error al guardar el estado del curso', TipoAlerta.ALERTA_ERROR);
        console.error(err)

        Notificacion.notificar(this.notificationServiceLocal, 'Hubo un error al guardar el estado del curso', TipoAlerta.ALERTA_ERROR);
        this.showLoading = false;
      }
    });
  }

  private rechazarCurso() {
    console.log("rechazar curso");
  }

  private notificar(mensaje: string, tipo: TipoAlerta) {
    Notificacion.notificar(this.notificationServiceLocal, mensaje, tipo);
  }

  cursoSeleccionadoEvent($event: Curso) {
    this.cursoSeleccionado = $event;
    this.cargarInformacionCurso(this.cursoSeleccionado).then(
      () => {
        this.esVistaListaCursos = false;
        this.esVistaValidacionCurso = true;
      }
    );
    console.log($event)
  }

  volverAListaCursos() {
    this.esVistaListaCursos = true;
    this.esVistaValidacionCurso = false;
    this.cursoSeleccionado = null;
    this.aprobarCursoForm.reset();
  }

  onAprobarCurso() {
    if (this.aprobarCursoForm.invalid) {
      this.aprobarCursoForm.markAllAsTouched();
      return;
    }
    this.aprobarCurso();
  }

  descargarDocumento(codDocumento: number) {
    this.archivoService.descargar(String(codDocumento)).subscribe({
      next: (archivo) => {
        const url = window.URL.createObjectURL(archivo);
        window.open(url);
      },
      error: (err) => {
        console.error(err);
        Notificacion.notificar(this.notificationServiceLocal, 'Hubo un error al descargar el archivo', TipoAlerta.ALERTA_ERROR);
      }
    })
  }

}

