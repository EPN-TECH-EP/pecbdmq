import { Component, OnInit } from '@angular/core';
import {Submenu} from "../../../../../modelo/util/submenu";
import {MenuService} from "../../../../../servicios/menu.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu-reportes-pro',
  templateUrl: './menu-reportes-pro.component.html',
  styleUrls: ['./menu-reportes-pro.component.scss']
})
export class MenuReportesProComponent extends Submenu implements OnInit{

  constructor(private menuService: MenuService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }
}
