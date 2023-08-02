import { Component, OnInit } from '@angular/core';
import { Submenu } from "../../../../../modelo/util/submenu";
import { MenuService } from "../../../../../servicios/menu.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-menu-administracion-especializacion',
  templateUrl: './menu-administracion-especializacion.component.html',
  styleUrls: ['./menu-administracion-especializacion.component.scss']
})
export class MenuAdministracionEspecializacionComponent extends Submenu implements OnInit {

  constructor(private menuService: MenuService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }
}
