import { Component, OnInit } from '@angular/core';
import { RegistroNotasService } from "../../../../../servicios/formacion/registro-notas.service";
import { Notificacion } from "../../../../../util/notificacion";
import { MdbNotificationService } from "mdb-angular-ui-kit/notification";
import { TipoAlerta } from "../../../../../enum/tipo-alerta";
import { MenuService } from "../../../../../servicios/menu.service";
import { Router } from "@angular/router";
import { Submenu } from "../../../../../modelo/util/submenu";

@Component({
  selector: 'app-menu-administracion-especializacion-academia',
  templateUrl: './menu-especializacion-academia.component.html',
  styleUrls: ['./menu-especializacion-academia.component.scss']
})
export class MenuEspecializacionAcademiaComponent extends Submenu implements OnInit {

  constructor(
    private registroNotasService: RegistroNotasService,
    private ns: MdbNotificationService,
    private menuService: MenuService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }



}
