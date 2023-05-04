import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router
} from '@angular/router';

import { AutenticacionService } from '../servicios/autenticacion.service';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionGuard implements CanActivate {
  constructor(
    private autenticacionService: AutenticacionService,
    private router: Router,
    //private notificationService: NotificationService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.isUserLoggedIn();
  }

  private isUserLoggedIn(): boolean {
    if (this.autenticacionService.isUsuarioLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    /* this.autenticacionService.notify(
      NotificationType.ERROR,`You need to log in to access this page`
    ); */
    return false;
  }

  /*canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }*/
}
