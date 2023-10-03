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
    this.showLoading = true;

    this.listarPeriodosAcademicos();
    this.listarCursos();
    this.listarProPeriodos();

    this.route.data.subscribe(data => {
      this.reporteRequest.codigoReporte = data.codigo;
      this.reporteriaService.getReporte(data.codigo).subscribe(response => {
        this.reporteResponse = response;
        this.showLoading = false;
      }, (error) => {
        this.showLoading = false;
        this.router.navigate(['/principal/reporteria/menu']);
      });
    });
    for (let i = this.currentYear - 100; i <= this.currentYear; i++) {
      this.yearsArray.push(i);
    }
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


  downloadFile(fileType: string) {
    this.showLoading = true;
    this.fijarDatos();

    const fileExtension = fileType === 'pdf' ? 'pdf' : 'xlsx';
    const mimeType = fileType === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    const reporteMap = {
      'GENERAL_MALLA': {
        serviceFn: () => this.reporteriaService.generarMallaCurricular(fileType),
        fileName: `Malla.${fileExtension}`
      },
      'GENERAL_GENERAL': {
        serviceFn: () => this.reporteriaService.generarReporteGeneral(this.selectedYear, fileType),
        fileName: `reporteGeneral.${fileExtension}`
      },
      'GENERAL_ANTIGUEDADES': {
        serviceFn: () => this.reporteriaService.generarAntiguedades(fileType),
        fileName: `Antigüedades.${fileExtension}`
      },
      'FORMACION_APROBADOS': {
        serviceFn: () => this.reporteriaService.generarAprobadosFormacion(fileType),
        fileName: `aprobados.${fileExtension}`
      },
      'ESPECIALIZACION_APROBADOS': {
        serviceFn: () => this.reporteriaService.generarAprobadosEspecializacion(this.selectedCurso.codCursoEspecializacion, fileType),
        fileName: `aprobadosEspecializacion.${fileExtension}`
      },
      'ESPECIALIZACION_EVALUACIONES': {
        serviceFn: () => this.reporteriaService.generarEvaluaciones(this.selectedCurso.codCursoEspecializacion, fileType),
        fileName: `evaluacionesEspecializacion.${fileExtension}`
      }
    };

    if (reporteMap[this.reporteRequest.codigoReporte]) {
      const {serviceFn, fileName} = reporteMap[this.reporteRequest.codigoReporte];
      serviceFn().subscribe(data => {
        this.processResponse(data, mimeType, fileName);
      }, error => {
        this.handleError(fileType, error);
      });
    } else {
      const serviceFn = fileType === 'pdf' ?
        () => this.reporteriaService.generarPdf(this.reporteRequest) :
        () => this.reporteriaService.generarExcel(this.reporteRequest);

      serviceFn().subscribe(data => {
        const fileName = `${this.reporteResponse.nombre}.${fileExtension}`;
        this.processResponse(data, mimeType, fileName);
      }, error => {
        this.handleError(fileType, error);
      });
    }
  }

  processResponse(data: any, mimeType: string, fileName: string) {
    const blob = new Blob([data], {type: mimeType});
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(url);
    this.showLoading = false;
  }

  handleError(fileType: string, error: any) {
    this.showLoading = false;
    console.error(`Error al descargar el ${fileType}:`, error);
    const errorMsg = `No se logró descargar el archivo en formato ${fileType.toUpperCase()}`;
    Notificacion.notificacion(this.notificationRef, this.notificationServiceLocal, null, errorMsg);
  }

  downloadPdf() {
    this.downloadFile('pdf');
  }

  downloadExcel() {
    this.downloadFile('excel');
  }


}
