import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../modelo/usuario';
import { CustomHttpResponse } from '../modelo/custom-http-response';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.host}/usuario/lista`);
  }

  public nuevoUsuario(formData: FormData): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.host}/usuario/nuevo`, formData);
  }

  public actualizarUsuario(usuario: Usuario): Observable<Usuario> {
    console.log(usuario);
    return this.http.post<Usuario>(`${this.host}/usuario/actualizar`, usuario);
  }

  public resetPassword(email: string): Observable<CustomHttpResponse> {
    return this.http.get<CustomHttpResponse>(`${this.host}/usuario/resetPassword/${email}`);
  }

  public actualizarImagenPerfil(formData: FormData): Observable<HttpEvent<Usuario>> {
    return this.http.post<Usuario>(`${this.host}/usuario/actualizarImagenPerfil`, formData,
    {reportProgress: true,
      observe: 'events'
    });
  }

  public eliminarUsuario(nombreUsuario: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/usuario/eliminar/${nombreUsuario}`);
  }

  public agregarUsuariosACacheLocal(Usuarios: Usuario[]): void {
    localStorage.setItem('usuarios', JSON.stringify(Usuarios));
  }

  public obtenerUsuariosDeCacheLocal(): Usuario[] {
    if (localStorage.getItem('usuarios')) {
        return JSON.parse(localStorage.getItem('usuarios'));
    }
    return null;
  }

  /*public crearUsuarioFormData(nombreUsuarioLogueado: string, usuario: Usuario, imagenPerfil: File): FormData {
    const formData = new FormData();
    formData.append('currentUsuarioname', nombreUsuarioLogueado);
    formData.append('firstName', usuario.nombres);
    formData.append('lastName', usuario.apellidos);
    formData.append('Usuarioname', usuario.nombreUsuario);
    formData.append('email', usuario.email);    
    formData.append('profileImage', imagenPerfil);
    formData.append('isActive', JSON.stringify(usuario.active));
    formData.append('isNonLocked', JSON.stringify(usuario.notLocked));
    return formData;
  }*/
}
