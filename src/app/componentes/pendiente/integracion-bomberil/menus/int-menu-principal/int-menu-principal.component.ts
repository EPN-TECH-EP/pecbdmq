import { Component, OnInit } from '@angular/core';
import { Submenu } from "../../../../../modelo/util/submenu";
import { MenuService } from "../../../../../servicios/menu.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-int-menu-principal',
  templateUrl: './int-menu-principal.component.html',
  styleUrls: ['./int-menu-principal.component.scss']
})
export class IntMenuPrincipalComponent extends Submenu implements OnInit{

  constructor(private menuService: MenuService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }
}
