import {Component, OnInit} from '@angular/core';
import {Notificacion} from "../../../../util/notificacion";
import {ComponenteBase} from "../../../../util/componente-base";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {MdbPopconfirmService} from "mdb-angular-ui-kit/popconfirm";
import {ReporteriaService} from "../../../../servicios/reporteria.service";
import {ReporteRequest, ReporteResponse} from "../../../../modelo/dto/reporte.dto";
import {ActivatedRoute, Router} from "@angular/router";

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




  constructor(private notificationServiceLocal: MdbNotificationService,
              private reporteriaService: ReporteriaService,
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
    for(let i = this.currentYear - 100; i <= this.currentYear; i++) {
      this.yearsArray.push(i);
    }
    }

  downloadPdf() {
    this.showLoading = true;
    if(this.reporteRequest.codigoReporte == 'GENERAL_MALLA'){
    this.reporteriaService.generarMallaCurricular( 'pdf').subscribe(data => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'Malla.pdf';  // Aquí puedes colocar el nombre de archivo que prefieras
      anchor.click();
      window.URL.revokeObjectURL(url);
      this.showLoading=false;
    });}
    else if(this.reporteRequest.codigoReporte == 'GENERAL_GENERAL'){
      this.reporteriaService.generarReporteGeneral(this.selectedYear,'pdf').subscribe(data => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'reporteGeneral.pdf';  // Aquí puedes colocar el nombre de archivo que prefieras
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.showLoading=false;
      });

    }
    else if(this.reporteRequest.codigoReporte == 'GENERAL_ANTIGUEDADES'){
      this.reporteriaService.generarAntiguedades( 'pdf').subscribe(data => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'Antigüedades.pdf';  // Aquí puedes colocar el nombre de archivo que prefieras
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.showLoading=false;
      });

      }

  }

  downloadExcel() {
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
      this.reporteriaService.generarReporteGeneral(this.selectedYear,'excel').subscribe(data => {
        const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'reporteGeneral.xlsx';  // Aquí puedes colocar el nombre de archivo que prefieras
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.showLoading = false;
      });

    }
    else if(this.reporteRequest.codigoReporte == 'GENERAL_ANTIGUEDADES'){
      this.reporteriaService.generarAntiguedades( 'excel').subscribe(data => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'a.xlsx';  // Aquí puedes colocar el nombre de archivo que prefieras
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.showLoading=false;
      });
    }
  }


}
