import { Component, OnInit } from '@angular/core';
import { Documento, PeriodoAcademico, PeriodoAcademicoService } from "../../../../servicios/periodo-academico.service";
import { Notificacion } from "../../../../util/notificacion";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { DocumentosService } from "../../../../servicios/formacion/documentos.service";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";

@Component({
  selector: 'app-periodo-academico',
  templateUrl: './periodo-academico.component.html',
  styleUrls: ['./periodo-academico.component.scss']
})
export class PeriodoAcademicoComponent implements OnInit {

  esVistaListaPeriodosAcademicos: boolean = true;
  esVistaDocumentosAsociados: boolean = false;
  periodosAcademicos: PeriodoAcademico[]
  periodoAcademico: PeriodoAcademico
  headers: { key: string; label: string; }[];

  constructor(
    private periodoAcademicoService: PeriodoAcademicoService,
    private documentosService: DocumentosService,
    private ns: MdbNotificationService
  ) {
    this.periodosAcademicos = []
    this.periodoAcademico = null;
    this.headers = [
      { key: 'nombre', label: 'Nombre' },
      { key: 'fechaInicio', label: 'Descripción' },
    ]
  }

  ngOnInit(): void {
    this.periodoAcademicoService.listarPeriodosAcademicos().subscribe({
      next: (data) => {
        this.periodosAcademicos = data;
      }
    })
  }

  verDocumentosAsociados(periodo: PeriodoAcademico) {
    this.esVistaDocumentosAsociados = true;
    this.esVistaListaPeriodosAcademicos = false;
    this.periodoAcademico = periodo;
  }

  volverAListaPeriodosAcademicos() {
    this.esVistaListaPeriodosAcademicos = true;
    this.esVistaDocumentosAsociados = false;
    this.periodoAcademico = null;
  }

  descargarDocumento(documento: Documento) {
    this.documentosService.descargar(documento.codDocumento).subscribe(
      {
        next: (data) => {
          const blob = new Blob([data], {type: 'application/pdf'});
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${documento.nombre}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.log('Error al descargar documento', error);
          Notificacion.notificar(this.ns, 'Error al descargar documento', TipoAlerta.ALERTA_ERROR)
        }
      });
  }
}
