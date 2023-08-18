import { Component, OnInit } from '@angular/core';
import {Submenu} from "../../../../../modelo/util/submenu";
import {MenuService} from "../../../../../servicios/menu.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu-convocatoria-pro',
  templateUrl: './menu-convocatoria-pro.component.html',
  styleUrls: ['./menu-convocatoria-pro.component.scss']
})
export class MenuConvocatoriaProComponent extends Submenu implements OnInit{

  constructor(private menuService: MenuService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }
}

