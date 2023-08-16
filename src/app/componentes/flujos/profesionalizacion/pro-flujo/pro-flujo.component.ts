import {Component, OnInit, ViewChild} from '@angular/core';
import {ProConvocatoria} from "../../../../modelo/admin/pro-convocatoria";
import {Notificacion} from "../../../../util/notificacion";
import {ProConvocatoriaService} from "../../../../servicios/profesionalizacion/pro-convocatoria.service";
import {ProPeriodo} from "../../../../modelo/admin/profesionalizacion/pro-periodo";
import {ProPeriodoService} from "../../../../servicios/profesionalizacion/pro-periodo.service";
import {MdbNotificationRef, MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {AlertaComponent} from "../../../util/alerta/alerta.component";
import {FormGroup} from "@angular/forms";
import {MdbStepperComponent} from "mdb-angular-ui-kit/stepper";

@Component({
  selector: 'app-pro-flujo',
  templateUrl: './pro-flujo.component.html',
  styleUrls: ['./pro-flujo.component.scss']
})
export class ProFlujoComponent implements OnInit {
  selectedConvocatoria: ProConvocatoria;
  convocatorias: ProConvocatoria[];
  selectedPeriodo: ProPeriodo;
  periodos: ProPeriodo[];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  form: FormGroup;
  @ViewChild("stepper")
  stepper: MdbStepperComponent;

  constructor(
    private notificationServiceLocal: MdbNotificationService,
    private proConvocatoriaService: ProConvocatoriaService,
    private proPeriodoService: ProPeriodoService
  ) {
  }

  ngOnInit(): void {
    this.getPeriodos();

  }

  onSelectPeriodoChange() {
    this.proConvocatoriaService.getConvocatoriaPeriodo(this.selectedPeriodo.codigoPeriodo).subscribe(
      (response) => {
        this.selectedConvocatoria = response;
        if (response == null || response.estado === "FINALIZADA") {
          Notificacion.notificacionOK(
            this.notificationRef,
            this.notificationServiceLocal,
            "No existe convocatoia para el cohorte seleccionado"
          );
          this.stepper.resetAll();
        }
        else if (response.estado=="INSCRIPCION"){
          this.stepper.setNewActiveStep(1);
        }
        else if (response.estado=="VALIDACION"){
          this.stepper.setNewActiveStep(2);
        }
        else if (response.estado=="REGISTRO NOTAS"){
          this.stepper.setNewActiveStep(3);
        }
        else if (response.estado=="GRADUACION"){
          this.stepper.setNewActiveStep(4);
        }
        else if (response.estado=="FINALIZADO"){
          this.stepper.setNewActiveStep(4);
          this.stepper.submit()
        }
      },
      (error) => {
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          error
        );
      }
    )
  }

  private getPeriodos() {
    this.proPeriodoService.listar().subscribe(resp => {
      this.periodos = resp;
    })
  }

  siguientepaso1() {
    this.proConvocatoriaService.updateEstadoConvocatoria(this.selectedConvocatoria.codigo, "INSCRIPCION").subscribe((response) => {
      this.stepper.next();
      this.selectedConvocatoria = response;
      Notificacion.notificacionOK(
        this.notificationRef,
        this.notificationServiceLocal,
        "Flujo actualizado"
      );
    }, (error) => {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        error
      );
    })

  }

  siguientepaso2() {
    this.proConvocatoriaService.updateEstadoConvocatoria(this.selectedConvocatoria.codigo, "VALIDACION").subscribe((response) => {
      this.stepper.next();
      this.selectedConvocatoria = response;
      Notificacion.notificacionOK(
        this.notificationRef,
        this.notificationServiceLocal,
        "Flujo actualizado"
      );
    }, (error) => {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        error
      );
    })
  }

  anteriorPaso2() {
    this.proConvocatoriaService.updateEstadoConvocatoria(this.selectedConvocatoria.codigo, "ACTIVO").subscribe((response) => {
      this.stepper.previous();
      this.selectedConvocatoria = response;
      Notificacion.notificacionOK(
        this.notificationRef,
        this.notificationServiceLocal,
        "Flujo actualizado"
      );
    }, (error) => {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        error
      );
    })
  }

  anteriorPaso3() {
    this.proConvocatoriaService.updateEstadoConvocatoria(this.selectedConvocatoria.codigo, "INSCRIPCION").subscribe((response) => {
      this.stepper.previous();
      this.selectedConvocatoria = response;
      Notificacion.notificacionOK(
        this.notificationRef,
        this.notificationServiceLocal,
        "Flujo actualizado"
      );
    }, (error) => {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        error
      );
    })
  }

  siguientepaso3() {
    this.proConvocatoriaService.updateEstadoConvocatoria(this.selectedConvocatoria.codigo, "REGISTRO NOTAS").subscribe((response) => {
      this.stepper.next();
      this.selectedConvocatoria = response;
      Notificacion.notificacionOK(
        this.notificationRef,
        this.notificationServiceLocal,
        "Flujo actualizado"
      );
    }, (error) => {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        error
      );
    })
  }

  anteriorPaso4() {
    this.proConvocatoriaService.updateEstadoConvocatoria(this.selectedConvocatoria.codigo, "VALIDACION").subscribe((response) => {
      this.stepper.previous();
      this.selectedConvocatoria = response;
      Notificacion.notificacionOK(
        this.notificationRef,
        this.notificationServiceLocal,
        "Flujo actualizado"
      );
    }, (error) => {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        error
      );
    })
  }

  siguientepaso4() {
    this.proConvocatoriaService.updateEstadoConvocatoria(this.selectedConvocatoria.codigo, "GRADUACION").subscribe((response) => {
      this.stepper.next();
      this.selectedConvocatoria = response;
      Notificacion.notificacionOK(
        this.notificationRef,
        this.notificationServiceLocal,
        "Flujo actualizado"
      );
    }, (error) => {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        error
      );
    })
  }

  anteriorPaso5() {
    if (this.selectedConvocatoria.estado=='GRADUACION'){
      this.proConvocatoriaService.updateEstadoConvocatoria(this.selectedConvocatoria.codigo, "REGISTRO NOTAS").subscribe((response) => {
        this.stepper.previous();
        this.selectedConvocatoria = response;
        Notificacion.notificacionOK(
          this.notificationRef,
          this.notificationServiceLocal,
          "Flujo actualizado"
        );
      }, (error) => {
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          error
        );
      })
    }
    else{
      this.proConvocatoriaService.updateEstadoConvocatoria(this.selectedConvocatoria.codigo, "GRADUACION").subscribe((response) => {
        this.selectedConvocatoria = response;
        Notificacion.notificacionOK(
          this.notificationRef,
          this.notificationServiceLocal,
          "Flujo actualizado"
        );
      }, (error) => {
        Notificacion.notificacion(
          this.notificationRef,
          this.notificationServiceLocal,
          error
        );
      })
    }

  }

  siguientepaso5() {
    this.proConvocatoriaService.updateEstadoConvocatoria(this.selectedConvocatoria.codigo, "FINALIZADO").subscribe((response) => {
      this.stepper.markAsCompleted = true;
      this.selectedConvocatoria = response;
      Notificacion.notificacionOK(
        this.notificationRef,
        this.notificationServiceLocal,
        "Flujo actualizado"
      );
    }, (error) => {
      Notificacion.notificacion(
        this.notificationRef,
        this.notificationServiceLocal,
        error
      );
    })
  }
}
