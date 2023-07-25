import { Component, OnInit } from '@angular/core';
import { MenuService } from "../../../../../servicios/menu.service";
import { Router } from "@angular/router";
import { Submenu } from "../../../../../modelo/util/submenu";
import { Notificacion } from "../../../../../util/notificacion";
import { TipoAlerta } from "../../../../../enum/tipo-alerta";
import { RegistroNotasService } from "../../../../../servicios/formacion/registro-notas.service";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { FormacionService } from "../../../../../servicios/formacion/formacion.service";
import { catchError, tap } from "rxjs/operators";
import { EMPTY, of } from "rxjs";
import { FORMACION } from "../../../../../util/constantes/fomacion.const";

@Component({
  selector: 'app-menu-graduacion',
  templateUrl: './menu-graduacion.component.html',
  styleUrls: ['./menu-graduacion.component.scss']
})
export class MenuGraduacionComponent extends Submenu implements OnInit {

  esEstadoGraduacion: boolean;

  constructor(
    private ns: MdbNotificationService,
    private registroNotasService: RegistroNotasService,
    private menuService: MenuService,
    private router: Router,
    private formacionService: FormacionService,
  ) {
    super();
    this.esEstadoGraduacion = false;
  }

  ngOnInit(): void {
    this.formacionService.getEstadoActual().pipe(
      catchError((error) => {
        console.error(error);
        return of(null);
      }),
      tap((estado) => {
        if (!estado || estado.httpStatusCode !== 200) {
          Notificacion.notificar(this.ns, "No se pudo obtener el estado actual", TipoAlerta.ALERTA_WARNING);
          this.router.navigate(['/formacion/proceso']).then();
          return EMPTY;
        }

        if (estado.mensaje === FORMACION.estadoGraduacion) {
          this.esEstadoGraduacion = true;
        }

        return EMPTY;
      })
    ).subscribe();
    super.initMenu(this.menuService, this.router);
  }

  calcularNotasFinales() {
    this.registroNotasService.calcularNotasFinales().subscribe({
      next: (data) => {
        console.log(data);
        Notificacion.notificar(this.ns, 'Notas calculadas correctamente', TipoAlerta.ALERTA_OK)
      },
      error: (error) => {
        console.log(error);
        Notificacion.notificar(this.ns, 'Error al calcular notas', TipoAlerta.ALERTA_ERROR)
      }
    })
  }
}
