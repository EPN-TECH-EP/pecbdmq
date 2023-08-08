import { Component, OnInit } from '@angular/core';
import { Submenu } from "../../../../../modelo/util/submenu";
import { MenuService } from "../../../../../servicios/menu.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-menu-reportes-esp',
  templateUrl: './menu-reportes-esp.component.html',
  styleUrls: ['./menu-reportes-esp.component.scss']
})
export class MenuReportesEspComponent extends Submenu implements OnInit {

  constructor(private menuService: MenuService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }

}
