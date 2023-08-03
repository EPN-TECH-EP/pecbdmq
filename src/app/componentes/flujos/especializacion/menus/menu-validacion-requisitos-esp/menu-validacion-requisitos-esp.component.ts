import { Component, OnInit } from '@angular/core';
import { MenuService } from "../../../../../servicios/menu.service";
import { Router } from "@angular/router";
import { Submenu } from "../../../../../modelo/util/submenu";

@Component({
  selector: 'app-menu-validacion-requisitos-esp',
  templateUrl: './menu-validacion-requisitos-esp.component.html',
  styleUrls: ['./menu-validacion-requisitos-esp.component.scss']
})
export class MenuValidacionRequisitosEspComponent extends Submenu implements OnInit {

  constructor(private menuService: MenuService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }
}
