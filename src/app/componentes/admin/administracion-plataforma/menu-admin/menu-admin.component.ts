import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Submenu } from 'src/app/modelo/util/submenu';
import { MenuService } from 'src/app/servicios/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.scss']
})
export class MenuAdminComponent extends Submenu implements OnInit {

  constructor(private menuService: MenuService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    super.initMenu(this.menuService, this.router);
  }

}
