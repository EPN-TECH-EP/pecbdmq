import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Usuario } from '../modelo/usuario';
import { Observable } from 'rxjs';
import { Menu } from '../modelo/admin/menu';
// localhost:8081/menu/lista/1

@Injectable({ providedIn: 'root' })
export class MenuService {
  public host = environment.apiUrl;
  private token: string;
  private usuarioLogueado: string;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  public obtenerMenuPorUsuario(usuario: Usuario) : Observable<Menu[]>{        
    return this.http.get<Menu[]>(`${this.host}/menu/lista/${usuario.nombreUsuario}`)
  }
}
