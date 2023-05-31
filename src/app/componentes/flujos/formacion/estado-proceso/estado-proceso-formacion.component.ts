import {Component, OnInit} from '@angular/core';
import {FormacionService} from "../../../../servicios/formacion/formacion.service";
import {ModuloEstado} from "../../../../modelo/admin/modulo-estado";
import {switchMap} from "rxjs";
import {Notificacion} from "../../../../util/notificacion";
import {MdbNotificationService} from "mdb-angular-ui-kit/notification";
import {TipoAlerta} from "../../../../enum/tipo-alerta";

@Component({
  selector: 'app-estado-proceso-formacion',
  templateUrl: './estado-proceso-formacion.component.html',
  styleUrls: ['./estado-proceso-formacion.component.scss']
})
export class EstadoProcesoFormacionComponent implements OnInit {

  estados: ModuloEstado[];
  stepsLoaded = false;

  constructor(
    private formacionService: FormacionService,
    private mdbNotificationService: MdbNotificationService
  ) {
    this.estados = [];
  }

  ngOnInit() {
    this.formacionService.getEstadosFormacion().pipe(
      switchMap((estados) => {
        estados.forEach((estado) => {
          this.estados[estado.orden - 1] = estado;
        });
        return this.formacionService.getEstadoActual();
      })
    ).subscribe((estado) => {
      const estadoCatalogoActual = this.estados.find(
        (estadoItem) => estadoItem.estadoCatalogo === estado.mensaje.toUpperCase()
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
    this.formacionService.actualizarEstadoActual(formData).subscribe(
      (response) => {
        console.log(response);
        Notificacion.notificar(this.mdbNotificationService, "Estado actualizado con éxito", TipoAlerta.ALERTA_OK)
      },
      (error) => {
        console.log(error);
        Notificacion.notificar(this.mdbNotificationService, "Error al actualizar el estado", TipoAlerta.ALERTA_ERROR)
      }
    );
  }
}
