import { Component, OnInit } from '@angular/core';
import { MenuService } from "../../../../../servicios/menu.service";
import { Router } from "@angular/router";
import { Submenu } from "../../../../../modelo/util/submenu";

@Component({
  selector: 'app-cap-menu-principal',
  templateUrl: './cap-menu-principal.component.html',
  styleUrls: ['./cap-menu-principal.component.scss']
})
export class CapMenuPrincipalComponent extends Submenu implements OnInit  {

  constructor(private menuService: MenuService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }
}
