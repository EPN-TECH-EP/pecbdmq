import { Component, OnInit } from '@angular/core';
import {Submenu} from "../../../../../modelo/util/submenu";
import {MenuService} from "../../../../../servicios/menu.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu-convocatoria-esp',
  templateUrl: './menu-convocatoria-especializacion.component.html',
  styleUrls: ['./menu-convocatoria-especializacion.component.scss']
})
export class MenuConvocatoriaEspecializacionComponent extends Submenu implements OnInit {

  constructor(private menuService: MenuService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }

}
