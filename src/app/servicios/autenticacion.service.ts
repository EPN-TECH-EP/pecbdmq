import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Usuario} from '../modelo/admin/usuario';
import {Materia} from '../modelo/admin/materias';
import {LocalDataService} from './util/local-data.service';
import {CustomHttpResponse} from '../modelo/admin/custom-http-response';
import {Menu} from "../modelo/admin/menu";


@Injectable({providedIn: 'root'})
export class AutenticacionService {


  public host = environment.apiUrl;
  private token: string;
  private usuarioLogueado: string;
  private jwtHelper = new JwtHelperService();

  private user = new BehaviorSubject<Usuario | null>(null);
  user$ = this.user.asObservable();


  constructor(private http: HttpClient, private lds: LocalDataService) {
  }

  public login(usuario: Usuario): Observable<HttpResponse<Usuario>> {
    return this.http.post<Usuario>(`${this.host}/usuario/login`, usuario, {observe: 'response'})
  }

  public registro(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.host}/usuario/registro`, usuario);
  }

  /*public resetPassword(nombreUsuario: string): Observable<string> {
    return this.http.post<string>(`${this.host}/usuario/resetpassword/${nombreUsuario}`, null);
  }*/

  public resetPassword(nombreUsuario: string): Observable<any> {
    const url = `${this.host}/usuario/resetPassword/${nombreUsuario}`;
    return this.http.post(url, {});
  }

  public logOut(): void {
    this.token = null;
    this.usuarioLogueado = null;
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('Usuarios');
  }

  public guardaToken(token: string): void {
    this.token = token;
    this.lds.saveData('token', token);
  }

  public agregaUsuarioACache(usuario: Usuario): void {
    this.lds.saveData('usuario', JSON.stringify(usuario));
  }

  public obtieneUsuarioDeCache(): Usuario {
    const usuario: Usuario = JSON.parse(this.lds.getData('usuario'));
    this.user.next(usuario);
    return usuario;
  }

  public agregaMenuACache(menu: Menu[]): void {
    this.lds.saveData('data', JSON.stringify(menu));
  }

  public obtieneMenuDeCache(): Menu[] {
    const menu: Menu[] = JSON.parse(this.lds.getData('data'));
    return menu;
  }

  public cargaToken(): void {
    this.token = this.lds.getData('token');
  }

  public getToken(): string {
    return this.token;
  }

  public isUsuarioLoggedIn(): boolean {

    let respuesta: boolean = false;

    this.cargaToken();
    if (this.token != null && this.token !== '') {
      if (this.jwtHelper.decodeToken(this.token).sub != null || '') {
        if (!this.jwtHelper.isTokenExpired(this.token)) {
          this.usuarioLogueado = this.jwtHelper.decodeToken(this.token).sub;
          respuesta = true;
        }
      }
    } else {
      this.logOut();
      respuesta = false;
    }


    return respuesta;
  }

}
