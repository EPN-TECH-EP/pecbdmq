import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Usuario } from '../modelo/admin/usuario';
import { Observable } from 'rxjs';
import { Menu } from '../modelo/admin/menu';
import {AutenticacionService} from "./autenticacion.service";


@Injectable({ providedIn: 'root' })
export class MenuService {
  public host = environment.apiUrl;
  private token: string;
  private usuarioLogueado: string;
  private jwtHelper = new JwtHelperService();

  private menu: Menu[];

  constructor(private http: HttpClient, private autenticacionService: AutenticacionService) {}

  public obtenerMenuPorUsuario(usuario: Usuario) : Observable<Menu[]>{
    //console.log(usuario);
    return this.http.get<Menu[]>(`${this.host}/menu/lista/${usuario.nombreUsuario}`)
  }

  public getMenu(){
    if(this.menu == null || this.menu == undefined){
      this.menu = this.autenticacionService.obtieneMenuDeCache();
    }

    return this.menu;

  }

  public setMenu(pMenu: Menu[]){
    this.menu = pMenu;
  }

  public listarMenu(): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.host}/menu/listar`);
  }

  // menu/listarPrimerNivel
  public listarMenuPrimerNivel(): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.host}/menu/listarPrimerNivel`);
  }

  // menu/listarHijos/{codMenuPadre}
  public listarHijos(codMenuPadre: number): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.host}/menu/listarHijos/${codMenuPadre}`);
  }

  // crear
  public crear(menu: Menu): Observable<HttpResponse<Menu>> {
    return this.http.post<Menu>(`${this.host}/menu/crear`, menu, {observe: 'response'});
  }

  // actualizar
  public actualizar(menu: Menu): Observable<HttpResponse<Menu>> {
    return this.http.put<Menu>(`${this.host}/menu/actualizar`, menu, {observe: 'response'});
  }

  //eliminar
  public eliminar(codMenu: number): Observable<string> {
    return this.http.delete<string>(`${this.host}/menu/${codMenu}`);
  }
}
