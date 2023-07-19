import { Component, OnInit } from '@angular/core';
import { MenuService } from "../../../../../servicios/menu.service";
import { Router } from "@angular/router";
import { Submenu } from "../../../../../modelo/util/submenu";

@Component({
  selector: 'app-menu-convocatoria',
  templateUrl: './menu-convocatoria.component.html',
  styleUrls: ['./menu-convocatoria.component.scss']
})
export class MenuConvocatoriaComponent extends Submenu implements OnInit {

  constructor(private menuService: MenuService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }

}
