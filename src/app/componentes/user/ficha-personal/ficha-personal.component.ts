import { Component, OnInit } from '@angular/core';
import { forkJoin, switchMap, throwError } from "rxjs";
import { ComponenteBase } from "../../../util/componente-base";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { MdbPopconfirmService } from "mdb-angular-ui-kit/popconfirm";
import { AutenticacionService } from "../../../servicios/autenticacion.service";
import { UsuarioService } from "../../../servicios/usuario.service";
import { HttpErrorResponse } from "@angular/common/http";
import { TipoAlerta } from "../../../enum/tipo-alerta";
import { Notificacion } from "../../../util/notificacion";
import { FormacionHistoricoService } from "../../../servicios/consultaHistoricas/formacion-historico.service";
import {
  EspecializacionHistoricoService
} from "../../../servicios/consultaHistoricas/especializacion-historico.service";
import { Usuario } from "../../../modelo/admin/usuario";
import { Estudiante } from "../../../modelo/flujos/Estudiante";
import { NotaMateriaPorEstudiante } from "../../../servicios/formacion/estudiante.service";
import { ApelacionesService, ApelacionResponse } from "../../../servicios/formacion/apelaciones.service";
import { MdbModalRef, MdbModalService } from "mdb-angular-ui-kit/modal";
import {
  ModalSansionComponent
} from "../../flujos/formacion/formacion-academica/modal-sansion/modal-sansion.component";
import { ModalApelacionComponent } from "../../util/modal-apelacion/modal-apelacion.component";
import { catchError, map, mergeMap } from "rxjs/operators";

@Component({
  selector: 'app-ficha-personal',
  templateUrl: './ficha-personal.component.html',
  styleUrls: ['./ficha-personal.component.scss']
})
export class FichaPersonalComponent extends ComponenteBase implements OnInit {

  usuario: Usuario
  estudiante: Estudiante
  apelaciones: ApelacionResponse[]

  notasMateriaPorEstudiante: NotaMateriaPorEstudiante[];
  notaMateriaPorEstudiante: NotaMateriaPorEstudiante;
  headersNotasPorEstudiante: {key: string, label: string}[];

  modalRef: MdbModalRef<ModalSansionComponent> | null = null;
  headers: {key: string, label: string}[];

  esVistaTablaDeNotas: boolean = false;
  esVistaApelaciones: boolean = false;

  // formacionEstudiante: FormacionEstudiante[];
  // espEstudiante: EspecializacionEstudiante[];
  // profEstudiante: ProfesionalizacionEstudiante[];
  // formacionInstructor: FormacionInstructor[];
  // espInstructor: EspecializacionInstructor[];
  // profInstructor: ProfesionalizacionInstructor[];
  // codUsuario: number;
  // codUnicoEstudiante: string = '';
  // codInstructor: number;
  // sinSeccionInstructor: boolean = true;
  // sinSeccionEstudiante: boolean = true;
  // sinSeccionFormacionEs: boolean = true;
  // sinSeccionEspecializacionEs: boolean = true;
  // sinSeccionProfesionalizacionEs: boolean = true;
  // sinSeccionFormacionIn: boolean = true;
  // sinSeccionEspecializacionIn: boolean = true;
  // sinSeccionProfesionalizacionIn: boolean = true;
  // headersMap = [
  //   { name: 'Materia', value: 'Materia' },
  //   { name: 'Instructor', value: 'Instructor' },
  //   { name: 'PorcentajeFinal', value: 'Porcentaje Final' },
  //   { name: 'NotaMinima', value: 'Nota Mínima' },
  //   { name: 'PesoMateria', value: 'Peso Materia' },
  //   { name: 'NumeroHoras', value: 'Número Horas' },
  //   { name: 'NotaPonderacion', value: 'Nota Ponderación' },
  //   { name: 'NotaDisciplina', value: 'Nota Disciplina' },
  //   { name: 'NotaMateria', value: 'Nota Materia' },
  // ]
  // headersMapEsp = [
  //   { name: 'Instructor', value: 'Instructor' },
  //   { name: 'TipoInstructor', value: 'Tipo instructor' },
  //   { name: 'Aula', value: 'Aula' },
  //   { name: 'TipoCurso', value: 'Tipo curso' },
  //   { name: 'CatalogoCurso', value: 'Catalogo curso' },
  //   { name: 'FechaInicioCurso', value: 'Inicio del curso' },
  //   { name: 'FechaFinCurso', value: 'Fin del curso' },
  //   { name: 'FechaInicioCargaNota', value: 'Inicio carga nota' },
  //   { name: 'FechaFinCargaNota', value: 'Fin carga nota' },
  //   { name: 'FechaCreaNota', value: 'Creación nota' },
  //   { name: 'HoraCreaNota', value: 'Hora creación' },
  //   { name: 'UsuarioModificacion', value: 'Usuario modificación' },
  //   { name: 'FechaModificacion', value: 'Modificación nota' },
  //   { name: 'HoraModificacionNota', value: 'Hora modificación' },
  //   { name: 'NotaFinalEspecializacion', value: 'Nota Final' },
  //   { name: 'Resultado', value: 'Resultado' },
  // ]
  // headersMapPro = [
  //   { name: 'Materia', value: 'Materia' },
  //   { name: 'Coordinador', value: 'Coordinador' },
  //   { name: 'NotaMinima', value: 'Nota Mínima' },
  //   { name: 'PesoMateria', value: 'Peso Materia' },
  //   { name: 'NumeroHoras', value: 'Número Horas' },
  //   { name: 'NotaMateria', value: 'Nota Materia' },
  //   { name: 'NotaDisciplina', value: 'Nota Disciplina' },
  // ]
  // headersMapProIn = [
  //   { name: 'nombreCargo', value: 'Nombre Cargo' },
  //   { name: 'nombreRango', value: 'Nombre Rango' },
  //   { name: 'nombreGrado', value: 'Nombre Grado' },
  //   { name: 'nombreMateria', value: 'Nombre Materia' },
  //   { name: 'semestre', value: 'Semestre' },
  // ]
  // headersMapEspIn = [
  //   { name: 'nombreCargo', value: 'Nombre Cargo' },
  //   { name: 'nombreRango', value: 'Nombre Rango' },
  //   { name: 'nombreGrado', value: 'Nombre Grado' },
  //   { name: 'nombreTipoInstructor', value: 'Nombre Tipo Instructor' },
  //   { name: 'instructor', value: 'Instructor' },
  //   { name: 'nombreAula', value: 'Nombre Aula' },
  //   { name: 'nombreTipoCurso', value: 'Nombre Tipo Curso' },
  //   { name: 'nombreCatalogoCurso', value: 'Nombre Catalogo Curso' },
  //   { name: 'fechaInicioCurso', value: 'Fecha de Inicio Curso' },
  //   { name: 'fechaFinCurso', value: 'Fecha de Fin Curso' },
  //   { name: 'fechaInicioCargaNota', value: 'Fecha de Inicio Carga de la Nota ' },
  //   { name: 'fechaFinCargaNota', value: 'Fecha de Fin Carga de la Nota' },
  // ]
  // headersMapIn = [
  //   { name: 'cargo', value: 'Nombre Cargo' },
  //   { name: 'rango', value: 'Nombre Rango' },
  //   { name: 'grado', value: 'Nombre Grado' },
  //   { name: 'nombreMateria', value: 'Nombre Materia' },
  //   { name: 'codPeriodoAcademico', value: 'Período Académico' },
  // ]


  constructor(
    private autenticacionService: AutenticacionService,
    private modalService: MdbModalService,
    private ns: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
    private usuarioService: UsuarioService,
    private especializacionHistoricoService: EspecializacionHistoricoService,
    private formacionHistoricoService: FormacionHistoricoService,
    private apelacionService: ApelacionesService,
  ) {
    super(ns, popconfirmServiceLocal);
    this.subscriptions = [];
    this.apelaciones = [];
    this.usuario = null;
    this.estudiante = null;
    this.headersNotasPorEstudiante = [
      { key: 'nombre', label: 'Materia' },
      { key: 'nombre', label: 'Nota Final' },
      { key: 'noFinal', label: 'Nota Final Disciplinaria' },
      { key: 'notaDisciplinaria', label: 'Nota Supletorio' },
    ];

    this.headers = [
      { key: 'fecha', label: 'Fecha' },
      { key: 'materia', label: 'Materia' },
      { key: 'nota', label: 'Nota Actual' },
      { key: 'observacionEstudiante', label: 'Observación' },
      { key: 'estado', label: 'Estado' },
    ];
    this.notaMateriaPorEstudiante = null;
  }

  ngOnInit(): void {

    this.autenticacionService.user$.pipe(
      switchMap((user) => this.formacionHistoricoService.esEstudiante(user.nombreUsuario))
    ).subscribe({
      next: (estudiante) => {
        if (estudiante) {
          this.estudiante = estudiante;
          this.cargarFormacion(estudiante.codEstudiante);
          this.cargarApelaciones(estudiante.codEstudiante);
        }

      },
      error: (errorResponse: HttpErrorResponse) => {
        console.log('Error checking if user is estudiante:', errorResponse);
      }
    });

  }

  private mostrarNorificaion(mensaje: string, tipo: TipoAlerta) {
    Notificacion.notificar(this.ns, mensaje, tipo);
  }

  private cargarFormacion(idEstudiante: number): void {
    this.subscriptions.push(
      this.formacionHistoricoService.listarNotasPorMateria(idEstudiante).subscribe(
        {
          next: (data) => {
            console.log(data)
            this.notasMateriaPorEstudiante = data;
          },
          error: (errorResponse: HttpErrorResponse) => {
            console.error(errorResponse);
          }
        }));
  }

  private cargarApelaciones(codUnico: number) {
    this.apelacionService.listarPorEstudiante(codUnico).pipe(
      mergeMap((data) => {
        const apelaciones$ = data.map((apelacion) =>
          this.apelacionService.getMateriaByCodNotaYCodEstudiante(apelacion.codNotaFormacion, this.estudiante.codEstudiante).pipe(
            map((materia) => {
              apelacion.nombreMateria = materia.nombreMateria;
              return apelacion;
            }),
            catchError((error) => {
              Notificacion.notificar(this.ns, error, TipoAlerta.ALERTA_ERROR);
              return throwError(error);
            })
          )
        );
        return forkJoin(apelaciones$);
      })
    ).subscribe((apelaciones) => {
      this.apelaciones = apelaciones;
    });
  }

  onApelarNota(nota: NotaMateriaPorEstudiante) {
    this.modalRef = this.modalService.open(ModalApelacionComponent, {
      data: {
        nota: nota,
        estudiante: this.estudiante
      },
      modalClass: 'modal-lg modal-dialog-centered',
    });
  }

  verTablaNotasPorMateria() {
    this.esVistaTablaDeNotas = !this.esVistaTablaDeNotas;
  }

  verApelaciones() {
    this.esVistaApelaciones = !this.esVistaApelaciones;
  }

}

// cargarEspecializacion(codUnico: string): void {
//   this.subscriptions.push(
//     this.especializacionHistoricoService.getMateriasEspecializacionHistoricos(codUnico).subscribe(
//       {
//         next: (data) => {
//           this.espEstudiante = data;
//           if (this.espEstudiante.length !== 0) {
//             this.sinSeccionEspecializacionEs = false;
//           }
//         },
//         error: (errorResponse: HttpErrorResponse) => {
//           this.notificacion(errorResponse);
//         }
//       }));
// }
//
// cargarProfesionalizacion(codUnico: string): void {
//   this.subscriptions.push(
//     this.profesionalizacionHistoricoService.getMateriasProfesionalizacionHistoricos(codUnico).subscribe(
//       {
//         next: (data) => {
//           this.profEstudiante = data;
//           if (this.profEstudiante.length !== 0) {
//             this.sinSeccionProfesionalizacionEs = false;
//           }
//
//         },
//         error: (errorResponse: HttpErrorResponse) => {
//           this.notificacion(errorResponse);
//         }
//       }));
// }
//
// cargarFormacionIn(cod: number): void {
//   this.subscriptions.push(
//     this.formacionHistoricoService.getMateriasFormacionHistoricosIn(cod).subscribe(
//       {
//         next: (data) => {
//           this.formacionInstructor = data;
//           if (this.formacionInstructor.length !== 0) {
//             this.sinSeccionFormacionIn = false;
//           }
//         },
//         error: (errorResponse: HttpErrorResponse) => {
//           this.notificacion(errorResponse);
//         }
//       }));
// }
//
// cargarEspecializacionIn(codUnico: number): void {
//   this.subscriptions.push(
//     this.especializacionHistoricoService.getMateriasEspecializacionHistoricosIn(codUnico).subscribe(
//       {
//         next: (data) => {
//           this.espInstructor = data;
//           console.log(data)
//           console.log(this.espInstructor)
//           if (this.espInstructor.length !== 0) {
//             this.sinSeccionEspecializacionIn = false;
//           }
//         },
//         error: (errorResponse: HttpErrorResponse) => {
//           this.notificacion(errorResponse);
//         }
//       }));
// }
//
// cargarProfesionalizacionIn(codUnico: number): void {
//   this.subscriptions.push(
//     this.profesionalizacionHistoricoService.getMateriasProfesionalizacionHistoricosIn(codUnico).subscribe(
//       {
//         next: (data) => {
//           this.profInstructor = data;
//           if (this.profInstructor.length !== 0) {
//             this.sinSeccionProfesionalizacionIn = false;
//           }
//         },
//         error: (errorResponse: HttpErrorResponse) => {
//           this.notificacion(errorResponse);
//         }
//       }));
// }
//
// ngOnDestroy(): void {
//   this.subscriptions.forEach((sub) => sub.unsubscribe());
//   window.location.reload();
// }
