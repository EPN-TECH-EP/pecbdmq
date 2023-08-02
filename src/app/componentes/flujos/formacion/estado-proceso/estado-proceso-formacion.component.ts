import { Component, OnInit } from '@angular/core';
import { FormacionService } from "../../../../servicios/formacion/formacion.service";
import { ModuloEstado } from "../../../../modelo/admin/modulo-estado";
import { switchMap } from "rxjs";
import { Notificacion } from "../../../../util/notificacion";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { TipoAlerta } from "../../../../enum/tipo-alerta";
import { timeout } from "rxjs/operators";
import { FORMACION } from "../../../../util/constantes/fomacion.const";
import { Router } from "@angular/router";

@Component({
  selector: 'app-estado-menu-proceso-formacion',
  templateUrl: './estado-proceso-formacion.component.html',
  styleUrls: ['./estado-proceso-formacion.component.scss']
})
export class EstadoProcesoFormacionComponent implements OnInit {

  estados: ModuloEstado[];
  stepsLoaded = false;
  esEstadoCierre = false;

  constructor(
    private formacionService: FormacionService,
    private mdbNotificationService: MdbNotificationService,
    private router: Router,
  ) {
    this.estados = [];
  }

  ngOnInit() {
    this.formacionService.getEstadosFormacion().pipe(
      switchMap((estados) => {
        console.log('del servicio: ', estados);
        this.estados = estados;
        return this.formacionService.getEstadoActual();
      })
    ).subscribe((estado) => {
      const estadoCatalogoActual = this.estados.find(
        (estadoItem) => estadoItem?.estadoCatalogo === estado?.mensaje.toUpperCase()
      );

      this.estados.forEach((estadoItem) => {
        if (estadoItem === estadoCatalogoActual) {
          estadoItem.estadoActual = 'actual';
        } else if (estadoItem.orden < estadoCatalogoActual?.orden) {
          estadoItem.estadoActual = 'completado';
        } else {
          estadoItem.estadoActual = 'siguiente';
        }
      });

      if (estadoCatalogoActual?.estadoCatalogo === FORMACION.estadoCierre) {
        this.esEstadoCierre = true;
      }

      this.stepsLoaded = true;
    });
  }

  updateStep(codigo: number) {
    const formData = new FormData();
    formData.append('estado', codigo.toString());
    formData.append('proceso', 'FORMACIÓN');
    formData.forEach((value, key) => {
      console.log(key + ': ' + value);
    });

    const estadoActualAnterior = this.estados.find((estadoItem) => estadoItem.estadoActual === 'actual');
    const estadoActualIndex = this.estados.findIndex((estadoItem) => estadoItem.estadoActual === 'actual');
    const estadoActual = this.estados.find((estadoItem) => estadoItem.codigo === codigo);
    console.log('estado actual: ', estadoActual);

    this.esEstadoCierre = estadoActual.estadoCatalogo === FORMACION.estadoCierre;

    this.formacionService.actualizarEstadoActual(formData).subscribe(
      {
        next: (response) => {
          console.log(response);
          Notificacion.notificar(this.mdbNotificationService, "Estado actualizado con éxito", TipoAlerta.ALERTA_OK);

        },
        error: (error) => {
          console.error(error);
          Notificacion.notificar(this.mdbNotificationService, "Error al actualizar el estado", TipoAlerta.ALERTA_ERROR);
          if (estadoActualAnterior) {
            this.estados[estadoActualIndex].estadoActual = 'completado';
            // setTimeout(()=>{
            //   window.location.reload();
            // }, 5000);
          }
        }
      }
    );
  }

  cerrarProceso() {
    this.formacionService.cerrarProcesoFormacion().subscribe({
      next: (response) => {
        if (response) {
          Notificacion.notificar(this.mdbNotificationService, "Proceso cerrado con éxito", TipoAlerta.ALERTA_OK);
          this.router.navigate(['/principal/bienvenida']).then();
        }
      },
      error: (error) => {
        console.error(error);
        Notificacion.notificar(this.mdbNotificationService, "Error al cerrar el proceso", TipoAlerta.ALERTA_ERROR);
      }
    })

  }
}
