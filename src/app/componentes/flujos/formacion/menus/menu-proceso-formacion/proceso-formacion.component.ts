import { Component, OnInit } from '@angular/core';
import { Submenu } from "../../../../../modelo/util/submenu";
import { MenuService } from "../../../../../servicios/menu.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-menu-proceso-formacion',
  templateUrl: './proceso-formacion.component.html',
  styleUrls: ['./proceso-formacion.component.scss']
})
export class ProcesoFormacionComponent extends Submenu implements OnInit {

  constructor(private menuService: MenuService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }

}
