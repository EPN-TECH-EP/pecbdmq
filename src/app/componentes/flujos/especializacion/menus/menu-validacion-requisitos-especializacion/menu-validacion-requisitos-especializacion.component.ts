import { Component, OnInit } from '@angular/core';
import { MenuService } from "../../../../../servicios/menu.service";
import { Router } from "@angular/router";
import { Submenu } from "../../../../../modelo/util/submenu";

@Component({
  selector: 'app-menu-validacion-requisitos',
  templateUrl: './menu-validacion-requisitos.component.html',
  styleUrls: ['./menu-validacion-requisitos.component.scss']
})
export class MenuValidacionRequisitosComponent extends Submenu implements OnInit {

  constructor(private menuService: MenuService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }
}
