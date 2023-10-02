import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MdbNotificationService} from 'mdb-angular-ui-kit/notification';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {ProPeriodo} from 'src/app/modelo/admin/profesionalizacion/pro-periodo';
import {ReporteRequest, ReporteResponse} from 'src/app/modelo/dto/reporte.dto';
import {Curso} from 'src/app/modelo/flujos/especializacion/Curso';
import {CursosService} from 'src/app/servicios/especializacion/cursos.service';
import {PeriodoAcademico, PeriodoAcademicoService} from 'src/app/servicios/periodo-academico.service';
import {ProPeriodoService} from 'src/app/servicios/profesionalizacion/pro-periodo.service';
import {ReporteriaService} from 'src/app/servicios/reporteria.service';
import {ComponenteBase} from 'src/app/util/componente-base';
import {CURSO_COMPLETO_ESTADO} from 'src/app/util/constantes/especializacion.const';
import {OPCIONES_DATEPICKER} from 'src/app/util/constantes/opciones-datepicker.const';
import {Notificacion} from 'src/app/util/notificacion';


@Component({
  selector: 'app-reporte-generico',
  templateUrl: './reporte-generico.component.html',
  styleUrls: ['./reporte-generico.component.scss']
})
export class ReporteGenericoComponent extends ComponenteBase implements OnInit {
  selectedYear: number;
  yearsArray: number[] = [];
  currentYear: number = new Date().getFullYear();
  selectedProPeriodo: ProPeriodo;
  proPeriodos: ProPeriodo[];

  selectedPeriodoAcademico: PeriodoAcademico;
  periodosAcademicos: PeriodoAcademico[];

  selectedCurso: Curso;
  cursos: Curso[];

  opcionesDatepicker = OPCIONES_DATEPICKER;
  minDate = new Date(2020, 1, 31);
  fechaInicio: Date;
  fechaFin: Date;

  reporteResponse: ReporteResponse = new ReporteResponse();
  reporteRequest: ReporteRequest = new ReporteRequest();

  constructor(
    private reporteriaService: ReporteriaService,
    private route: ActivatedRoute,
    private router: Router,
    private periodoService: ProPeriodoService,
    private periodoAcademicoService: PeriodoAcademicoService,
    private cursosService: CursosService,
    private notificationServiceLocal: MdbNotificationService,
    private popConfirmServiceLocal: MdbPopconfirmService) {
    super(notificationServiceLocal, popConfirmServiceLocal);
  }

  ngOnInit(): void {

    this.route.data.subscribe(data => {
      this.reporteRequest.codigoReporte = data.codigo;
      this.reporteriaService.getReporte(data.codigo).subscribe(response => {
        this.reporteResponse = response;
      }, (error) => {
        this.router.navigate(['/principal/reporteria/menu']);
      });
    });
    for (let i = this.currentYear - 100; i <= this.currentYear; i++) {
      this.yearsArray.push(i);
    }

    this.listarPeriodosAcademicos();
    this.listarCursos();
    this.listarProPeriodos();
  }

  private listarPeriodosAcademicos() {
    this.periodoAcademicoService.listarPeriodosAcademicos().subscribe({
      next: (data) => {
        this.periodosAcademicos = data;
      }
    });
  }

  private listarCursos() {
    this.cursosService.listarCursosPorEstado(CURSO_COMPLETO_ESTADO.TODOS).subscribe({
      next: (cursos) => {
        this.cursos = cursos
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  private listarProPeriodos() {
    this.periodoService.listar().subscribe((result) => {
      this.proPeriodos = result;
    });
  }

  fijarDatos() {
    this.reporteRequest.codigoPeriodoProfesionalizacion = this.selectedProPeriodo?.codigoPeriodo;
    this.reporteRequest.codigoPeriodoFormacion = this.selectedPeriodoAcademico?.codigo;
    this.reporteRequest.codigoCurso = this.selectedCurso?.codCursoEspecializacion;
    this.reporteRequest.fechaInicio = this.fechaInicio;
    this.reporteRequest.fechaFin = this.fechaFin;
  }

  downloadPdf() {
    this.showLoading = true;
    this.fijarDatos();
    console.log(this.reporteRequest.codigoReporte);
    if (this.reporteRequest.codigoReporte == 'GENERAL_MALLA') {
      this.reporteriaService.generarMallaCurricular('pdf').subscribe(data => {
        const blob = new Blob([data], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'Malla.pdf';  // Aquí puedes colocar el nombre de archivo que prefieras
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.showLoading = false;
      });
    } else if (this.reporteRequest.codigoReporte == 'GENERAL_GENERAL') {
      this.reporteriaService.generarReporteGeneral(this.selectedYear, 'pdf').subscribe(data => {
        const blob = new Blob([data], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'reporteGeneral.pdf';  // Aquí puedes colocar el nombre de archivo que prefieras
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.showLoading = false;
      });

    } else if (this.reporteRequest.codigoReporte == 'GENERAL_ANTIGUEDADES') {
      this.reporteriaService.generarAntiguedades('pdf').subscribe(data => {
        const blob = new Blob([data], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'Antigüedades.pdf';  // Aquí puedes colocar el nombre de archivo que prefieras
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.showLoading = false;
      });

    } else if (this.reporteRequest.codigoReporte == 'FORMACION_APROBADOS') {
      this.reporteriaService.generarAprobadosFormacion('pdf').subscribe(data => {
        const blob = new Blob([data], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'aprobados.pdf';  // Aquí puedes colocar el nombre de archivo que prefieras
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.showLoading = false;
      });
    } else if (this.reporteRequest.codigoReporte == 'ESPECIALIZACION_APROBADOS') {
      this.reporteriaService.generarAprobadosEspecializacion(this.selectedCurso.codCursoEspecializacion, 'pdf').subscribe(data => {
          const blob = new Blob([data], {type: 'application/pdf'});
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = 'aprobadosEspecializacion.pdf';  // Aquí puedes colocar el nombre de archivo que prefieras
          anchor.click();
          window.URL.revokeObjectURL(url);
          this.showLoading = false;
        }
      );

    } else if (this.reporteRequest.codigoReporte == 'ESPECIALIZACION_EVALUACIONES') {

      this.reporteriaService.generarEvaluaciones(this.selectedCurso.codCursoEspecializacion, 'pdf').subscribe(data => {
          const blob = new Blob([data], {type: 'application/pdf'});
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = 'evaluacionesEspecializacion.pdf';  // Aquí puedes colocar el nombre de archivo que prefieras
          anchor.click();
          window.URL.revokeObjectURL(url);
          this.showLoading = false;
        }
      );


    } else {
      this.reporteriaService.generarPdf(this.reporteRequest).subscribe(data => {
          const url = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none');
          document.body.appendChild(a);
          a.href = url;
          a.download = this.reporteResponse.nombre + '.pdf';
          a.click();
          this.showLoading = false;
          return url;
        },
        error => {
          this.showLoading = false;
          console.error('Error al descargar el PDF:', error);
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            null,
            'No se logró descargar el archivo en formato PDF'
          );
        });
    }
  }

  downloadExcel() {
    this.showLoading = true;
    this.fijarDatos();
    if (this.reporteRequest.codigoReporte == 'GENERAL_MALLA') {
      this.reporteriaService.generarMallaCurricular('excel').subscribe(data => {
        const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'Malla.xlsx';  // Aquí puedes colocar el nombre de archivo que prefieras
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.showLoading = false;
      });

    } else if (this.reporteRequest.codigoReporte == 'GENERAL_GENERAL') {
      this.reporteriaService.generarReporteGeneral(this.selectedYear, 'excel').subscribe(data => {
        const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'reporteGeneral.xlsx';  // Aquí puedes colocar el nombre de archivo que prefieras
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.showLoading = false;
      });

    } else if (this.reporteRequest.codigoReporte == 'GENERAL_ANTIGUEDADES') {
      this.reporteriaService.generarAntiguedades('excel').subscribe(data => {
        const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'Antigüedades.xlsx';  // Aquí puedes colocar el nombre de archivo que prefieras
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.showLoading = false;
      });
    } else if (this.reporteRequest.codigoReporte == 'FORMACION_APROBADOS') {
      this.reporteriaService.generarAprobadosFormacion('excel').subscribe(data => {
        const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'AprobadosFormacion.xlsx';  // Aquí puedes colocar el nombre de archivo que prefieras
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.showLoading = false;
      });

    } else if (this.reporteRequest.codigoReporte == 'ESPECIALIZACION_APROBADOS') {
      this.reporteriaService.generarAprobadosEspecializacion(this.selectedCurso.codCursoEspecializacion, 'excel').subscribe(data => {
        const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'AprobadosEsp.xlsx';  // Aquí puedes colocar el nombre de archivo que prefieras
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.showLoading = false;
      });

    } else if (this.reporteRequest.codigoReporte == 'ESPECIALIZACION_EVALUACIONES') {

      this.reporteriaService.generarEvaluaciones(this.selectedCurso.codCursoEspecializacion, 'excel').subscribe(data => {
        const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'EvaluacionesEsp.xlsx';  // Aquí puedes colocar el nombre de archivo que prefieras
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.showLoading = false;
      });


    } else {
      this.reporteriaService.generarExcel(this.reporteRequest).subscribe(data => {
          const url = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none');
          document.body.appendChild(a);
          a.href = url;
          a.download = this.reporteResponse.nombre + '.xlsx';
          a.click();
          this.showLoading = false;
          return url;
        },
        error => {
          this.showLoading = false;
          console.error('Error al descargar el excel:', error);
          Notificacion.notificacion(
            this.notificationRef,
            this.notificationServiceLocal,
            null,
            'No se logró descargar el archivo en formato Excel'
          );
        });
    }
  }

}