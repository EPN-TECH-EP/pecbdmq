import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../modelo/usuario';




@Injectable({  providedIn: 'root'})
export class AutenticacionService {


  public host = environment.apiUrl;
  private token: string;
  private usuarioLogueado: string;
  private jwtHelper = new JwtHelperService();


  constructor(private http: HttpClient) { }

    public login(usuario: Usuario): Observable<HttpResponse<Usuario>> {
    return this.http.post<Usuario>(`${this.host}/usuario/login`, usuario, { observe: 'response' });
  }

  public registro(usuario: Usuario): Observable<Usuario> {

    console.log("AutenticacionService - usuario:"+ JSON.stringify(usuario));

    return this.http.post<Usuario>(`${this.host}/usuario/registro`, usuario);
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
    localStorage.setItem('token', token);
  }

  public agregaUsuarioACache(usuario: Usuario): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  public obtieneUsuarioDeCache(): Usuario {
    return JSON.parse(localStorage.getItem('usuario'));
  }

  public cargaToken(): void {
    this.token = localStorage.getItem('token');
  }

  public getToken(): string {
    return this.token;
  }

  public isUsuarioLoggedIn(): boolean {

    let respuesta: boolean = false;

    this.cargaToken();
    if (this.token != null && this.token !== ''){
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

    console.log("isUsuarioLoggedIn() ********** " + respuesta);
    console.log(this.token);

    return respuesta;
  }

}
