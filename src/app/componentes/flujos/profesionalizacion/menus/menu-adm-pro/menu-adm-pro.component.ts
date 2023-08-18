import { Component, OnInit } from '@angular/core';
import {MenuService} from "../../../../../servicios/menu.service";
import {Router} from "@angular/router";
import {Submenu} from "../../../../../modelo/util/submenu";

@Component({
  selector: 'app-menu-adm-pro',
  templateUrl: './menu-adm-pro.component.html',
  styleUrls: ['./menu-adm-pro.component.scss']
})
export class MenuAdmProComponent extends Submenu implements OnInit{

  constructor(private menuService: MenuService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }
}
