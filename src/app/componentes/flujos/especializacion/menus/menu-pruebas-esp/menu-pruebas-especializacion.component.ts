import { Component, OnInit } from '@angular/core';
import {Submenu} from "../../../../../modelo/util/submenu";
import {MenuService} from "../../../../../servicios/menu.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu-pruebas-esp',
  templateUrl: './menu-pruebas-especializacion.component.html',
  styleUrls: ['./menu-pruebas-especializacion.component.scss']
})
export class MenuPruebasEspecializacionComponent extends Submenu implements OnInit {

  constructor(private menuService: MenuService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }

}
