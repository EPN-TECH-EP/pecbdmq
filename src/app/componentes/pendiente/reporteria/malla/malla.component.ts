import {Component, OnInit} from '@angular/core';
import {Notificacion} from "../../../../util/notificacion";
import {ComponenteBase} from "../../../../util/componente-base";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {MdbPopconfirmService} from "mdb-angular-ui-kit/popconfirm";
import {ReporteriaService} from "../../../../servicios/reporteria.service";
import {ReporteRequest, ReporteResponse} from "../../../../modelo/dto/reporte.dto";
import {ActivatedRoute, Router} from "@angular/router";
import {ProPeriodo} from "../../../../modelo/admin/profesionalizacion/pro-periodo";
import {PeriodoAcademico, PeriodoAcademicoService} from "../../../../servicios/periodo-academico.service";
import {Curso} from "../../../../modelo/flujos/especializacion/Curso";
import {CURSO_COMPLETO_ESTADO} from "../../../../util/constantes/especializacion.const";
import {ProPeriodoService} from "../../../../servicios/profesionalizacion/pro-periodo.service";
import {CursosService} from "../../../../servicios/especializacion/cursos.service";

@Component({
  selector: 'app-malla',
  templateUrl: './malla.component.html',
  styleUrls: ['./malla.component.scss']
})
export class MallaComponent extends ComponenteBase implements OnInit {
  descripcion: string = 'Malla Curricular';
  reporteResponse: ReporteResponse = new ReporteResponse();
  reporteRequest: ReporteRequest = new ReporteRequest();
// En tu componente
  selectedYear: number;
  yearsArray: number[] = [];
  currentYear: number = new Date().getFullYear();
  selectedProPeriodo: ProPeriodo;
  proPeriodos: ProPeriodo[];

  selectedPeriodoAcademico: PeriodoAcademico;
  periodosAcademicos: PeriodoAcademico[];

  selectedCurso: Curso;
  cursos: Curso[];


  constructor(private notificationServiceLocal: MdbNotificationService,
              private reporteriaService: ReporteriaService,
              private periodoService: ProPeriodoService,
              private periodoAcademicoService: PeriodoAcademicoService,
              private cursosService: CursosService,
              private route: ActivatedRoute,
              private router: Router,
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
  }

  downloadPdf() {
    this.showLoading = true;
    console.log(this.reporteRequest.codigoReporte)
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


    }

  }

    downloadExcel()
    {
      this.showLoading = true;
      if (this.reporteRequest.codigoReporte == 'GENERAL_MALLA') {
        this.reporteriaService.generarMallaCurricular('excel').subscribe(data => {
          const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = 'Antigüedades.xlsx';  // Aquí puedes colocar el nombre de archivo que prefieras
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
          anchor.download = 'a.xlsx';  // Aquí puedes colocar el nombre de archivo que prefieras
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
          anchor.download = 'aprobados.xlsx';  // Aquí puedes colocar el nombre de archivo que prefieras
          anchor.click();
          window.URL.revokeObjectURL(url);
          this.showLoading = false;
        });

      }
      else if (this.reporteRequest.codigoReporte == 'ESPECIALIZACION_APROBADOS') {
        this.reporteriaService.generarAprobadosEspecializacion(this.selectedCurso.codCursoEspecializacion,'excel').subscribe(data => {
          const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = 'aprobadosEsp.xlsx';  // Aquí puedes colocar el nombre de archivo que prefieras
          anchor.click();
          window.URL.revokeObjectURL(url);
          this.showLoading = false;
        });

      }
      else if (this.reporteRequest.codigoReporte == 'ESPECIALIZACION_EVALUACIONES') {

        this.reporteriaService.generarEvaluaciones(this.selectedCurso.codCursoEspecializacion,'excel').subscribe(data => {
          const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = 'EvaluacionesEsp.xlsx';  // Aquí puedes colocar el nombre de archivo que prefieras
          anchor.click();
          window.URL.revokeObjectURL(url);
          this.showLoading = false;
        });


      }


  }
}
