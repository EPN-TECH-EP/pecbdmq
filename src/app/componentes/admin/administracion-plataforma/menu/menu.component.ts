import { Component, OnInit } from '@angular/core';
import { MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { Menu } from 'src/app/modelo/admin/menu';
import { MenuService } from 'src/app/servicios/menu.service';
import { ComponenteBase } from 'src/app/util/componente-base';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends ComponenteBase implements OnInit {

  menusPrimerNivel: Menu[] = [];
  menussegundoNivel: Menu[] = [];
  menusTercerNivel: Menu[] = [];

  menuN1Seleccionado: Menu = new Menu();
  menuN2Seleccionado: Menu = new Menu();
  menuN3Seleccionado: Menu = new Menu();

  constructor(
    private menuService: MenuService,
    private notificationServiceLocal: MdbNotificationService,
    private popconfirmServiceLocal: MdbPopconfirmService,
  ) {
    super(notificationServiceLocal, popconfirmServiceLocal);
  }

  ngOnInit(): void {
    this.subscriptions.push(
    this.menuService.listarMenuPrimerNivel().subscribe((data: Menu[]) => {
      this.menusPrimerNivel = data;
    })
    );
  }

}
