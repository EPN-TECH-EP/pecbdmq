import { Component, OnInit } from '@angular/core';
import {MenuService} from "../../../../../servicios/menu.service";
import {Router} from "@angular/router";
import {Submenu} from "../../../../../modelo/util/submenu";

@Component({
  selector: 'app-menu-gestion',
  templateUrl: './menu-gestion.component.html',
  styleUrls: ['./menu-gestion.component.scss']
})
export class MenuGestionComponent extends Submenu implements OnInit {

  constructor(private menuService: MenuService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }

}
