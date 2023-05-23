import {Component, OnInit} from '@angular/core';
import {FormacionService} from "../../../../servicios/formacion/formacion.service";
import {ModuloEstado} from "../../../../modelo/admin/modulo-estado";
import {MdbStepperOrientation} from "mdb-angular-ui-kit/stepper";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-estado-proceso-formacion',
  templateUrl: './estado-proceso-formacion.component.html',
  styleUrls: ['./estado-proceso-formacion.component.scss']
})
export class EstadoProcesoFormacionComponent implements OnInit {

  estados: ModuloEstado[]

  constructor(
    private formacionService: FormacionService,
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
    });
  }

}
