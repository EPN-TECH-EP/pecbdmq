import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { Menu } from '../../modelo/admin/menu';
import { MenuService } from '../../servicios/menu.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MenuItem } from 'src/app/modelo/admin/menu-item';
import { Route, Router } from '@angular/router';
import { Notificacion } from 'src/app/util/notificacion';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent implements OnInit, OnDestroy {
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;

  listaMenu: Menu[];
  private subscriptions: Subscription[] = [];

  constructor(
    private menuService: MenuService,
    private autenticacionService: AutenticacionService,
    private router: Router,
    private notificationService: MdbNotificationService
  ) {}

  ngOnInit(): void {
    const usuario = this.autenticacionService.obtieneUsuarioDeCache();

    this.subscriptions.push(
      this.menuService.obtenerMenuPorUsuario(usuario).subscribe({
        next: (response: Menu[]) => {
          this.listaMenu = response;
          this.menuService.menu = response;

          if (this.router.url === '/principal') {
            this.router.navigate(['/principal/bienvenida']);
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          console.error(errorResponse);
        },
      })
    );

    //TODO eliminar
    //this.printpath('', this.router.config);
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
