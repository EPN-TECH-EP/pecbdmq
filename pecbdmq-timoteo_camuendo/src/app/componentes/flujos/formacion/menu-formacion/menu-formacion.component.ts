import { Component, OnInit } from '@angular/core';
import { Menu } from 'src/app/modelo/admin/menu';
import { MenuService } from 'src/app/servicios/menu.service';
import { Router } from '@angular/router';
import { Submenu } from 'src/app/modelo/util/submenu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu-formacion.component.html',
  styleUrls: ['./menu-formacion.component.scss'],
})
export class MenuFormacionComponent extends Submenu implements OnInit {
  /*listaMenu: Menu[];
  listaSubMenu: Menu[] = [];

  idMenuPadre: number;*/

  constructor(private menuService: MenuService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }
}
