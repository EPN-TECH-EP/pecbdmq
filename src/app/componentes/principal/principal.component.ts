import {Component, OnDestroy, OnInit} from '@angular/core';
import {AutenticacionService} from 'src/app/servicios/autenticacion.service';
import {Menu} from '../../modelo/admin/menu';
import {MenuService} from '../../servicios/menu.service';
import {Subscription} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {MenuItem} from 'src/app/modelo/admin/menu-item';
import {Route, Router} from '@angular/router';
import {Notificacion} from 'src/app/util/notificacion';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import {AlertaComponent} from '../util/alerta/alerta.component';
import {TipoAlerta} from 'src/app/enum/tipo-alerta';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  nombreUsuario: string = '';
  listaMenuInicial: Menu[] = null;
  listaMenu: Menu[] = null;
  estructuraMenu: Map<number, number[]> = new Map();
  sinMenu: boolean = false;

  constructor(
    private menuService: MenuService,
    private autenticacionService: AutenticacionService,
    private router: Router,
    private notificationService: MdbNotificationService
  ) {
  }

  ngOnInit(): void {


    const usuario = this.autenticacionService.obtieneUsuarioDeCache();
    this.nombreUsuario = usuario?.codDatosPersonales["nombre"] + " " + usuario?.codDatosPersonales["apellido"]

    this.listaMenu = this.menuService.getMenu();
    //console.log(this.listaMenu);
    //aconsole.log(this.menuService.getMenu());

    if (this.listaMenu === undefined || this.listaMenu.length == 0) {
      this.subscriptions.push(
        this.menuService.obtenerMenuPorUsuario(usuario).subscribe({
          next: (response: Menu[]) => {
            this.listaMenu = response;
            this.menuService.setMenu(response);

            if (this.listaMenu.length === 0)
              this.sinMenu = true;

            if (this.router.url === '/principal') {
              this.router.navigate(['/principal/bienvenida']);
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            console.error(errorResponse);
          },
        })
      );
    }

    //TODO eliminar
    //this.printpath('', this.router.config);
  }

  conformarMenu() {
    // conforma el menu, busca primero el primer nivel
    for (let index = 0; index < this.listaMenuInicial.length; index++) {
      const menu = this.listaMenuInicial[index];

      if (menu.menu_padre === null) {
        this.estructuraMenu.set(menu.codMenu, []);
      } else {
        let listaHijos = this.estructuraMenu.get(menu.menu_padre);
        if (listaHijos !== undefined) {
          listaHijos.push(menu.codMenu);
          this.estructuraMenu.set(menu.menu_padre, listaHijos);
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public onLogOut(): void {
    this.autenticacionService.logOut();
    this.router.navigate(['/login']);

    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      'Se ha cerrado la sesión',
      TipoAlerta.ALERTA_OK
    );
  }


  /*printpath(parent: String, config: Route[]) {
    for (let i = 0; i < config.length; i++) {
      const route = config[i];
      console.log(parent + '/' + route.path);
      if (route.children) {
        const currentPath = route.path ? parent + '/' + route.path : parent;
        this.printpath(currentPath, route.children);
      }
    }
  }*/
}
