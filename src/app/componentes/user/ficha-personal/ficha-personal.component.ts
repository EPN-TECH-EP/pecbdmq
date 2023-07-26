import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ComponenteBase} from "../../../util/componente-base";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {MdbPopconfirmService} from "mdb-angular-ui-kit/popconfirm";
import {AutenticacionService} from "../../../servicios/autenticacion.service";
import {UsuarioService} from "../../../servicios/usuario.service";
import {HttpErrorResponse} from "@angular/common/http";
import {CustomHttpResponse} from "../../../modelo/admin/custom-http-response";
import {TipoAlerta} from "../../../enum/tipo-alerta";
import {Notificacion} from "../../../util/notificacion";
import { FormacionEstudiante } from "../../../modelo/dto/formacion-usuario.dto";
import { EspecializacionEstudiante } from "../../../modelo/dto/especializacion-usuario.dto";
import { ProfesionalizacionEstudiante } from "../../../modelo/dto/profesionalizacion-usuario.dto";
import { FormacionInstructor } from "../../../modelo/dto/formacion-instructor.dto";
import { EspecializacionInstructor } from "../../../modelo/dto/especializacion-instructor.dto";
import { ProfesionalizacionInstructor } from "../../../modelo/dto/profesionalizacion-instructor.dto";
import { FormacionHistoricoService } from "../../../servicios/consultaHistoricas/formacion-historico.service";
import {
  EspecializacionHistoricoService
} from "../../../servicios/consultaHistoricas/especializacion-historico.service";
import {
  ProfesionalizacionHistoricoService
} from "../../../servicios/consultaHistoricas/profesionalizacion-historico.service";

@Component({
  selector: 'app-ficha-personal',
  templateUrl: './ficha-personal.component.html',
  styleUrls: ['./ficha-personal.component.scss']
})
export class FichaPersonalComponent extends ComponenteBase implements OnInit {
  formacionEstudiante: FormacionEstudiante[];
  espEstudiante: EspecializacionEstudiante[];
  profEstudiante: ProfesionalizacionEstudiante[];
  formacionInstructor: FormacionInstructor[];
  espInstructor: EspecializacionInstructor[];
  profInstructor: ProfesionalizacionInstructor[];
  codUsuario: number;
  codUnicoEstudiante: string = '';
  codInstructor: number;
  sinSeccionInstructor: boolean = true;
  sinSeccionEstudiante: boolean = true;
  sinSeccionFormacionEs: boolean = true;
  sinSeccionEspecializacionEs: boolean = true;
  sinSeccionProfesionalizacionEs: boolean = true;
  sinSeccionFormacionIn: boolean = true;
  sinSeccionEspecializacionIn: boolean = true;
  sinSeccionProfesionalizacionIn: boolean = true;
  headersMap = [
    {name: 'Materia', value: 'Materia'},
    {name: 'Instructor', value: 'Instructor'},
    {name: 'PorcentajeFinal', value: 'Porcentaje Final'},
    {name: 'NotaMinima', value: 'Nota Mínima'},
    {name: 'PesoMateria', value: 'Peso Materia'},
    {name: 'NumeroHoras', value: 'Número Horas'},
    {name: 'NotaPonderacion', value: 'Nota Ponderación'},
    {name: 'NotaDisciplina', value: 'Nota Disciplina'},
    {name: 'NotaMateria', value: 'Nota Materia'},
  ]
  headersMapEsp = [
    {name: 'Instructor', value: 'Instructor'},
    {name: 'TipoInstructor', value: 'Tipo instructor'},
    {name: 'Aula', value: 'Aula'},
    {name: 'TipoCurso', value: 'Tipo curso'},
    {name: 'CatalogoCurso', value: 'Catalogo curso'},
    {name: 'FechaInicioCurso', value: 'Inicio del curso'},
    {name: 'FechaFinCurso', value: 'Fin del curso'},
    {name: 'FechaInicioCargaNota', value: 'Inicio carga nota'},
    {name: 'FechaFinCargaNota', value: 'Fin carga nota'},
    {name: 'FechaCreaNota', value: 'Creación nota'},
    {name: 'HoraCreaNota', value: 'Hora creación'},
    {name: 'UsuarioModificacion', value: 'Usuario modificación'},
    {name: 'FechaModificacion', value: 'Modificación nota'},
    {name: 'HoraModificacionNota', value: 'Hora modificación'},
    {name: 'NotaFinalEspecializacion', value: 'Nota Final'},
    {name: 'Resultado', value: 'Resultado'},
  ]
  headersMapPro = [
    {name: 'Materia', value: 'Materia'},
    {name: 'Coordinador', value: 'Coordinador'},
    {name: 'NotaMinima', value: 'Nota Mínima'},
    {name: 'PesoMateria', value: 'Peso Materia'},
    {name: 'NumeroHoras', value: 'Número Horas'},
    {name: 'NotaMateria', value: 'Nota Materia'},
    {name: 'NotaDisciplina', value: 'Nota Disciplina'},
  ]
  headersMapProIn = [
    {name: 'nombreCargo', value: 'Nombre Cargo'},
    {name: 'nombreRango', value: 'Nombre Rango'},
    {name: 'nombreGrado', value: 'Nombre Grado'},
    {name: 'nombreMateria', value: 'Nombre Materia'},
    {name: 'semestre', value: 'Semestre'},
  ]
  headersMapEspIn = [
    {name: 'nombreCargo', value: 'Nombre Cargo'},
    {name: 'nombreRango', value: 'Nombre Rango'},
    {name: 'nombreGrado', value: 'Nombre Grado'},
    {name: 'nombreTipoInstructor', value: 'Nombre Tipo Instructor'},
    {name: 'instructor', value: 'Instructor'},
    {name: 'nombreAula', value: 'Nombre Aula'},
    {name: 'nombreTipoCurso', value: 'Nombre Tipo Curso'},
    {name: 'nombreCatalogoCurso', value: 'Nombre Catalogo Curso'},
    {name: 'fechaInicioCurso', value: 'Fecha de Inicio Curso'},
    {name: 'fechaFinCurso', value: 'Fecha de Fin Curso'},
    {name: 'fechaInicioCargaNota', value: 'Fecha de Inicio Carga de la Nota '},
    {name: 'fechaFinCargaNota', value: 'Fecha de Fin Carga de la Nota'},
  ]
  headersMapIn = [
    {name: 'cargo', value: 'Nombre Cargo'},
    {name: 'rango', value: 'Nombre Rango'},
    {name: 'grado', value: 'Nombre Grado'},
    {name: 'nombreMateria', value: 'Nombre Materia'},
    {name: 'codPeriodoAcademico', value: 'Período Académico'},
  ]


  constructor(

    private autenticacionService: AutenticacionService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
    private usuarioService: UsuarioService,
    private especializacionHistoricoService: EspecializacionHistoricoService,
    private formacionHistoricoService: FormacionHistoricoService,
    private profesionalizacionHistoricoService: ProfesionalizacionHistoricoService

  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);
    this.subscriptions = [];
  }

  ngOnInit(): void {
    const usuario = this.autenticacionService.obtieneUsuarioDeCache();
    this.codUsuario = usuario?.codUsuario;
    this.subscriptions.push(
      this.usuarioService.buscarUsuarioInfo(this.codUsuario).subscribe({
          next: (data) => {
            this.codUnicoEstudiante = data.codUnicoEstudiante;
            this.codInstructor = data.codInstructor;
            console.log(this.codUnicoEstudiante)
            console.log(this.codInstructor)
            if (this.codUnicoEstudiante !== null) {
              this.sinSeccionEstudiante = false;
              this.cargarFormacion(this.codUnicoEstudiante);
              this.cargarEspecializacion(this.codUnicoEstudiante);
              this.cargarProfesionalizacion(this.codUnicoEstudiante);
            }
            if (this.codInstructor !== null) {
              this.sinSeccionInstructor = false;
              this.cargarFormacionIn(this.codInstructor);
              this.cargarEspecializacionIn(this.codInstructor)
              this.cargarProfesionalizacionIn(this.codInstructor)
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.notificacion(errorResponse);
          }
        }
      )
    );

  }

  private notificacion(errorResponse: HttpErrorResponse) {
    let customError: CustomHttpResponse = errorResponse.error;
    let tipoAlerta: TipoAlerta = TipoAlerta.ALERTA_WARNING;

    let mensajeError = customError.mensaje;
    let codigoError = errorResponse.status;

    if (!mensajeError) {
      mensajeError = 'Error inesperado';
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }

    if (codigoError === 0) {
      mensajeError = 'Error de conexión al servidor';
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }

    if (this.notificationRef) {
      this.notificationRef.close();
    }

    this.notificationRef = Notificacion.notificar(
      this.notificationServiceLocal,
      mensajeError,
      tipoAlerta
    );
  }

  cargarFormacion(codUnico: string): void {
    this.subscriptions.push(
      this.formacionHistoricoService.getMateriasFormacionHistoricos(codUnico).subscribe(
        {
          next:(data) => {
            this.formacionEstudiante = data;
            if(this.espEstudiante.length!==0) {
              this.sinSeccionFormacionEs = false;
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.notificacion(errorResponse);
          }
        }));
  }

  cargarEspecializacion(codUnico: string): void {
    this.subscriptions.push(
      this.especializacionHistoricoService.getMateriasEspecializacionHistoricos(codUnico).subscribe(
        {
          next:(data) => {
            this.espEstudiante = data;
            if(this.espEstudiante.length!==0) {
              this.sinSeccionEspecializacionEs = false;
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.notificacion(errorResponse);
          }
        }));
  }

  cargarProfesionalizacion(codUnico: string): void {
    this.subscriptions.push(
      this.profesionalizacionHistoricoService.getMateriasProfesionalizacionHistoricos(codUnico).subscribe(
        {
          next: (data) => {
            this.profEstudiante = data;
            if(this.profEstudiante.length!==0) {
              this.sinSeccionProfesionalizacionEs = false;
            }

          },
          error: (errorResponse: HttpErrorResponse) => {
            this.notificacion(errorResponse);
          }
        }));
  }

  cargarFormacionIn(cod: number): void {
    this.subscriptions.push(
      this.formacionHistoricoService.getMateriasFormacionHistoricosIn(cod).subscribe(
        {
          next:(data) => {
            this.formacionInstructor = data;
            if(this.formacionInstructor.length!==0) {
              this.sinSeccionFormacionIn = false;
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.notificacion(errorResponse);
          }
        }));
  }

  cargarEspecializacionIn(codUnico: number): void {
    this.subscriptions.push(
      this.especializacionHistoricoService.getMateriasEspecializacionHistoricosIn(codUnico).subscribe(
        {
          next:(data) => {
            this.espInstructor = data;
            console.log(data)
            console.log(this.espInstructor)
            if(this.espInstructor.length!==0) {
              this.sinSeccionEspecializacionIn = false;
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.notificacion(errorResponse);
          }
        }));
  }

  cargarProfesionalizacionIn(codUnico: number): void {
    this.subscriptions.push(
      this.profesionalizacionHistoricoService.getMateriasProfesionalizacionHistoricosIn(codUnico).subscribe(
        {
          next: (data) => {
            this.profInstructor = data;
            if(this.profInstructor.length!==0) {
              this.sinSeccionProfesionalizacionIn = false;
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.notificacion(errorResponse);
          }
        }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    window.location.reload();
  }
}
