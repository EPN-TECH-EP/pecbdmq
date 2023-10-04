import {Component, OnInit} from '@angular/core';
import {forkJoin, switchMap, throwError} from "rxjs";
import {ComponenteBase} from "../../../util/componente-base";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {MdbPopconfirmService} from "mdb-angular-ui-kit/popconfirm";
import {AutenticacionService} from "../../../servicios/autenticacion.service";
import {UsuarioService} from "../../../servicios/usuario.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {TipoAlerta} from "../../../enum/tipo-alerta";
import {Notificacion} from "../../../util/notificacion";
import {FormacionHistoricoService} from "../../../servicios/consultaHistoricas/formacion-historico.service";
import {
  EspecializacionHistoricoService
} from "../../../servicios/consultaHistoricas/especializacion-historico.service";
import {Usuario} from "../../../modelo/admin/usuario";
import {Estudiante} from "../../../modelo/flujos/Estudiante";
import {EstudianteService, NotaMateriaPorEstudiante} from "../../../servicios/formacion/estudiante.service";
import {ApelacionesService, ApelacionResponse} from "../../../servicios/formacion/apelaciones.service";
import {MdbModalRef, MdbModalService} from "mdb-angular-ui-kit/modal";
import {
  ModalSansionComponent
} from "../../flujos/formacion/formacion-academica/modal-sansion/modal-sansion.component";
import {ModalApelacionComponent} from "../../util/modal-apelacion/modal-apelacion.component";
import {catchError, map, mergeMap} from "rxjs/operators";
import {Router} from "@angular/router";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {MdbTabChange} from "mdb-angular-ui-kit/tabs/tabs.component";
import {FormacionEstudiante} from "../../../modelo/dto/formacion-usuario.dto";
import {ReporteriaService} from "../../../servicios/reporteria.service";


@Component({
  selector: 'app-ficha-personal',
  templateUrl: './ficha-personal.component.html',
  styleUrls: ['./ficha-personal.component.scss']
})
export class FichaPersonalComponent extends ComponenteBase implements OnInit {

  usuario: Usuario
  estudiante: Estudiante
  estudiateFormacion: FormacionEstudiante;
  apelaciones: ApelacionResponse[]

  notasMateriaPorEstudiante: NotaMateriaPorEstudiante[];
  notaMateriaPorEstudiante: NotaMateriaPorEstudiante;
  headersNotasPorEstudiante: { key: string, label: string }[];

  modalRef: MdbModalRef<ModalSansionComponent> | null = null;
  headers: { key: string, label: string }[];
  codEstudianteFormacion: number = 0;
  codEstudianteEspecializacion: number = 0;

  esVistaTablaDeNotas: boolean = false;
  esVistaApelaciones: boolean = false;
  esVistaSubidaDocumentos: boolean = false;
  esVistaCalendario: boolean = false;

  esVistaMenu: boolean = true;

  constructor(
    private autenticacionService: AutenticacionService,
    private sanitizer: DomSanitizer,
    private modalService: MdbModalService,
    private ns: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
    private usuarioService: UsuarioService,
    private especializacionHistoricoService: EspecializacionHistoricoService,
    private formacionHistoricoService: FormacionHistoricoService,
    private apelacionService: ApelacionesService,
    private estudianteService: EstudianteService,
    private router: Router,
    private httpClient: HttpClient,
    private reporteriaService: ReporteriaService,
  ) {
    super(ns, popconfirmServiceLocal);
    this.subscriptions = [];
    this.apelaciones = [];
    this.usuario = null;
    this.estudiante = null;
    this.headersNotasPorEstudiante = [
      {key: 'nombre', label: 'Materia'},
      {key: 'nombre', label: 'Nota Final'},
      {key: 'noFinal', label: 'Nota Final Disciplinaria'},
      {key: 'notaDisciplinaria', label: 'Nota Supletorio'},
    ];

    this.headers = [
      {key: 'fecha', label: 'Fecha'},
      {key: 'materia', label: 'Materia'},
      {key: 'nota', label: 'Nota Actual'},
      {key: 'observacionEstudiante', label: 'Observación'},
      {key: 'estado', label: 'Estado'},
    ];
    this.notaMateriaPorEstudiante = null;
  }

  ngOnInit(): void {

    console.log('ngOnInit');

    this.autenticacionService.user$.subscribe({
      next: (usuario) => {
        if (usuario) this.usuario = usuario;
      }
    });

  }

  private mostrarNotificacion(mensaje: string, tipo: TipoAlerta) {
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

  private cargarDatosEstudianteFormacion(codUsuario: string) {
    this.especializacionHistoricoService.obtenerEstudianteFormacion(codUsuario).subscribe({
      next: (estudiante) => {
        console.log('estudiante Formacion', estudiante);
        this.estudiante = estudiante;
        this.codEstudianteFormacion = estudiante ? estudiante.codEstudiante : 0;

      },
      error: (errorResponse: HttpErrorResponse) => {
        console.log('Error checking if user is estudiante:', errorResponse);
        this.mostrarNotificacion('Error al cargar el usuario', TipoAlerta.ALERTA_ERROR)
      }
    });

  }

  private cargarDatosEstudianteEspecializacion(codUsuario: string) {
    this.especializacionHistoricoService.obtenerEstudianteEspecializacion(codUsuario).subscribe({
      next: (estudiante) => {
        console.log('estudiante Especializacion', estudiante);
        this.estudiante = estudiante;
        this.codEstudianteEspecializacion = estudiante ? estudiante.codEstudiante : 0;
      },
      error: (errorResponse: HttpErrorResponse) => {
        console.log('Error checking if user is estudiante:', errorResponse);
        this.mostrarNotificacion('Error al cargar el usuario', TipoAlerta.ALERTA_ERROR)
      }
    });
  }

  private cargarDatosEstudianteProfesionalizacion(codUsuario: number) {
    console.log('cargarDatosEstudianteProfesionalizacion');
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
    this.esVistaMenu = false;
  }

  verApelaciones() {
    this.esVistaApelaciones = !this.esVistaApelaciones;
    this.esVistaMenu = false;

  }

  verSubidaDocumentos() {
    this.esVistaSubidaDocumentos = !this.esVistaSubidaDocumentos;
    this.esVistaMenu = false;

  }

  regresarVistaMenu() {
    this.esVistaMenu = true;
    this.esVistaCalendario = false;
    this.esVistaApelaciones = false;
    this.esVistaSubidaDocumentos = false;
    this.esVistaTablaDeNotas = false;
  }

  verCalendario() {
    this.esVistaCalendario = !this.esVistaCalendario;
    this.esVistaMenu = false;

  }

  abrirRepositorioMateria(nota: NotaMateriaPorEstudiante) {
    this.estudianteService.estudiante = this.estudiante
    this.formacionHistoricoService.nota = nota;
    this.router.navigate(['principal/formacion/estudiante/repositorio']).then();
  }

  descargarCertificado(): void {
    const archivoUrl = 'assets/docs/certificado.pdf'; // Ruta relativa al archivo en la carpeta 'assets'

    // Realizar una solicitud GET para obtener el archivo
    this.httpClient.get(archivoUrl, {responseType: 'blob'}).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);

      // Crear un enlace de descarga seguro
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificado.pdf'; // Nombre del archivo para descargar
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }

  verCursosTomados() {
    this.estudianteService.estudiante = this.estudiante;
    this.router.navigate(['principal/formacion/estudiante/cursos-tomados']).then();
  }

  onTabChange(event: MdbTabChange): void {
    if (event.index === 0) {
      console.log('Formacion');
      this.cargarDatosEstudianteFormacion(this.usuario.nombreUsuario);
    }

    if (event.index === 1) {
      console.log('Especializacion');
      this.cargarDatosEstudianteEspecializacion(this.usuario.nombreUsuario);
    }

    if (event.index === 2) {
      console.log('Profesionalizacion');
    }
    if (event.index === 3) {
      console.log('Reporte');
      this.cargarDatosEstudianteEspecializacion(this.usuario.nombreUsuario);
      this.cargarDatosEstudianteFormacion(this.usuario.nombreUsuario);

    }
  }

  downloadPdf() {
    this.showLoading = true;
    this.reporteriaService.generarNotaFichaPersonal('pdf', this.codEstudianteFormacion, this.codEstudianteEspecializacion).subscribe(data => {
      const blob = new Blob([data], {type: 'application/pdf'});
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'Mis Notas.pdf';  // Aquí puedes colocar el nombre de archivo que prefieras
      anchor.click();
      window.URL.revokeObjectURL(url);
      this.showLoading = false;
    });

  }

  downloadExcel() {
    this.reporteriaService.generarNotaFichaPersonal('excel', this.codEstudianteFormacion, this.codEstudianteEspecializacion).subscribe(data => {
      const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'Mis notas.xlsx';  // Aquí puedes colocar el nombre de archivo que prefieras
      anchor.click();
      window.URL.revokeObjectURL(url);
      this.showLoading = false;
    });


  }
}
