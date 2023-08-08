import { Component, OnInit } from '@angular/core';
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
    private menuService: MenuService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }



}
