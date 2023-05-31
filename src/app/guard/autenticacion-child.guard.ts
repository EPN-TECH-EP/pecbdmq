import { Injectable, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChildFn, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../servicios/autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionChildGuard {

    constructor(@Inject(AutenticacionService) private autenticacionService: AutenticacionService,
    private router: Router,) { }


  canActivateChild: CanActivateChildFn = (
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    

    if (this.autenticacionService.isUsuarioLoggedIn()) {
      return true;
    } else {      
      this.router.navigate(['/login']);
      return false;
    }
  }
}
