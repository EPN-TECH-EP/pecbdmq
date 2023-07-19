import { Component, OnInit } from '@angular/core';
import { MenuService } from "../../../../../servicios/menu.service";
import { Router } from "@angular/router";
import { Submenu } from "../../../../../modelo/util/submenu";
import { Notificacion } from "../../../../../util/notificacion";
import { TipoAlerta } from "../../../../../enum/tipo-alerta";
import { RegistroNotasService } from "../../../../../servicios/formacion/registro-notas.service";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";

@Component({
  selector: 'app-menu-graduacion',
  templateUrl: './menu-graduacion.component.html',
  styleUrls: ['./menu-graduacion.component.scss']
})
export class MenuGraduacionComponent extends Submenu implements OnInit {

  constructor(
    private ns : MdbNotificationService,
    private registroNotasService: RegistroNotasService,
    private menuService: MenuService, private router: Router) {
    super();
  }

  ngOnInit(): void {
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
