import { MenuService } from 'src/app/servicios/menu.service';
import { Menu } from '../admin/menu';
import { Router } from '@angular/router';

export class Submenu {
  listaMenu: Menu[];
  public listaSubMenu: Menu[] = [];

  idMenuPadre: number;

  initMenu(menuService: MenuService, router: Router) {

    // obtiene menú de usuario
    this.listaMenu = menuService.getMenu();

    // si el menu tiene elementos
    if (this.listaMenu !== undefined && this.listaMenu.length > 0) {
      // obtiene la ruta actual
      const rutaActual = router.url;

      // todo eliminar log

      // // busca el id del menú padre
      for (let index = 0; index < this.listaMenu.length; index++) {
        const menu = this.listaMenu[index];

        if (this.containsAllSubroutes(rutaActual, String(menu.ruta))) {
          this.idMenuPadre = menu.codMenu;

          break;
        }
      }


      // obtiene los menús hijos
      for (let index = 0; index < this.listaMenu.length; index++) {
        const menu = this.listaMenu[index];

        if (menu.menuPadre === this.idMenuPadre) {
          this.listaSubMenu.push(menu);
          console.log('lista submenu', this.listaSubMenu);
        }
      }
    }
  }


  containsAllSubroutes(rutaActual, menuRuta) {
    const regex = new RegExp(`(^|/)${menuRuta}(/|$)`);
    return regex.test(rutaActual);
  }
}
