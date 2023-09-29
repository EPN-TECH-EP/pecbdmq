import { Component, OnInit } from '@angular/core';
import { Submenu } from "../../../../../modelo/util/submenu";
import { MenuService } from "../../../../../servicios/menu.service";
import { Router } from "@angular/router";
import { MdbTabChange } from "mdb-angular-ui-kit/tabs/tabs.component";

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.scss']
})
export class MenuPrincipalComponent extends Submenu implements OnInit {

  constructor(private menuService: MenuService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }


  onTabChange($event: MdbTabChange) {

  }
}
