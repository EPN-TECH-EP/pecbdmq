import { Injectable, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChildFn, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { MenuService } from '../servicios/menu.service';
import {Subscription} from 'rxjs';
import { Menu } from '../modelo/admin/menu';


@Injectable({
  providedIn: 'root'
})
export class AutenticacionChildGuard {


  menuRutas: string[] = [];
  private subscriptions: Subscription[] = [];
  listaMenuInicial: Menu[] = null; 
  sinMenu: boolean = false;
  estructuraMenu: Map<number, number[]> = new Map();
  listaMenu: Menu[] = null;
  urlsPermitidos: string[];
  tieneAcceso = false;


    constructor(@Inject(AutenticacionService) private autenticacionService: AutenticacionService,
    private menuService: MenuService,
    private router: Router
    ) {
      
     }


  canActivateChild: CanActivateChildFn = (
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    const usuario = this.autenticacionService.obtieneUsuarioDeCache();//obtener usuario de cache
    this.listaMenuInicial = this.menuService.getMenu();//para verificar si es undefined
    const url1 = state.url;// Obtenemos el segmento de la ruta actual del URL.
    this.urlsPermitidos = this.menuService.getMenu()?.map(menu => menu.ruta );//intentamos obtener los urlPermitidos
      
    if (this.autenticacionService.isUsuarioLoggedIn()) {

      if (this.urlsPermitidos === undefined) {
          this.subscriptions.push(
            this.menuService.obtenerMenuPorUsuario(usuario).subscribe({
              next: (response: Menu[]) => {
                this.listaMenuInicial = response;
                this.menuService.setMenu(response);
                this.urlsPermitidos = this.menuService.getMenu()?.map(menu => menu.ruta ); //obtenemos los urlsPermitidos
                this.verificarAcceso(url1);
                if (this.listaMenuInicial.length === 0) {
                  this.sinMenu = true;
                } else {
                  this.conformarMenu();
                }
                if (this.router.url === '/principal') {
                  this.router.navigate(['/principal/bienvenida']);
                }
              }, 
            })
          );
        } else {
          this.conformarMenu();
          
        }
    } else {
      // Si el usuario no está autenticado, redirigir al login.
      this.router.navigate(['/login']);
      return false;
    }

    
  }
  verificarAcceso(url: string) {
    let tieneAcceso = this.urlsPermitidos?.some(endpoint => url.includes(endpoint));
    if (tieneAcceso) {
      // El usuario tiene permiso, retornar true.
      return true;
    } else {
      // Si el usuario no tiene permiso, redirigir a la página principal.
      this.router.navigate(['/principal/bienvenida']);
      return false;
      
    }
  }
  conformarMenu() {
    // conforma el menu, busca primero el primer nivel
    for (let index = 0; index < this.listaMenuInicial.length; index++) {
      const menu = this.listaMenuInicial[index];

      if (menu.menuPadre === null) {
        this.estructuraMenu.set(menu.codMenu, []);
      } else {
        let listaHijos = this.estructuraMenu.get(menu.menuPadre);
        if (listaHijos !== undefined) {
          listaHijos.push(menu.codMenu);
          this.estructuraMenu.set(menu.menuPadre, listaHijos);
        }
      }
    }

    // estructura el menu definitivo
    this.estructuraMenu.forEach((value: number[], key: number) => {
      const menu = this.listaMenuInicial.find((m) => m.codMenu === key);
      if (menu !== undefined) {
        // añade el menú padre actual
        if (this.listaMenu === null) {
          this.listaMenu = [];
        }

        this.listaMenu.push(menu);

        // añade en orden los hijos del menú padre actual
        const hijos: number[] = value;

        hijos.forEach((id) => {
          const menuHijo = this.listaMenuInicial.find((m) => m.codMenu === id);
          if (menuHijo !== undefined) {
            this.listaMenu.push(menuHijo);
          }
        });
      }
    });
  }
}