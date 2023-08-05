import { Component, OnInit } from '@angular/core';
import { CursosService } from "../../../../servicios/especializacion/cursos.service";
import { CURSO_COMPLETO_ESTADO } from "../../../../util/constantes/especializacion.const";
import { Curso } from "../../../../modelo/flujos/especializacion/Curso";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { Notificacion } from "../../../../util/notificacion";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { Usuario } from "../../../../modelo/admin/usuario";
import { AutenticacionService } from "../../../../servicios/autenticacion.service";

@Component({
  selector: 'app-validacion-curso',
  templateUrl: './validacion-curso.component.html',
  styleUrls: ['./validacion-curso.component.scss']
})
export class ValidacionCursoComponent implements OnInit {

  usuario: Usuario;
  cursoSeleccionado: Curso;
  cursos: Curso[]
  estaCargando: boolean;
  esVistaListaCursos: boolean;
  esVistaValidacionCurso: boolean;
  aprobarCursoForm: FormGroup;

  constructor(
    private cursosService: CursosService,
    private builder: FormBuilder,
    private ns: MdbNotificationService,
    private auth: AutenticacionService) {
    this.cursoSeleccionado = null;
    this.usuario = null
    this.estaCargando = true;
    this.esVistaListaCursos = true;
    this.esVistaValidacionCurso = false;
    this.aprobarCursoForm = new FormGroup({});
    this.cursos = []
    this.construirFormulario();
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
      }
    });
  }

  private aprobarCurso() {
    this.cursosService.aprobar(
      this.aprobarCursoForm.controls['aprobado'].value,
      this.aprobarCursoForm.controls['observaciones'].value,
      this.usuario.codUsuario,
      this.cursoSeleccionado.codCursoEspecializacion,
    ).subscribe({
      next: () => {
        this.notificar('Curso aprobado correctamente', TipoAlerta.ALERTA_OK);
        this.volverAListaCursos();
        this.listarCursos();
      },
      error: (err) => {
        this.notificar('Hubo un error al guardar el estado del curso', TipoAlerta.ALERTA_ERROR);
        console.error(err)
      }
    });
  }

  private notificar(mensaje: string, tipo: TipoAlerta) {
    Notificacion.notificar(this.ns, mensaje, tipo);
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
}
