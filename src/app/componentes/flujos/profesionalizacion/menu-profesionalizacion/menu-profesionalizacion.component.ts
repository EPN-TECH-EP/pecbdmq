import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Submenu } from 'src/app/modelo/util/submenu';
import { MenuService } from 'src/app/servicios/menu.service';

@Component({
  selector: 'app-menu-profesionalizacion',
  templateUrl: './menu-profesionalizacion.component.html',
  styleUrls: ['./menu-profesionalizacion.component.scss']
})
export class MenuProfesionalizacionComponent extends Submenu implements OnInit {

  constructor(private menuService: MenuService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }

}
