import {Injectable} from '@angular/core';
import {
  HttpClient,
  HttpEvent, HttpParams,
} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Usuario} from '../modelo/admin/usuario';
import {CustomHttpResponse} from '../modelo/admin/custom-http-response';
import {UsuarioNombreApellido} from '../modelo/util/nombre-apellido';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.host}/usuario/lista`);
  }

  public nuevoUsuario(formData: FormData): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.host}/usuario/nuevo`, formData);
  }

  public actualizarUsuario(usuario: Usuario): Observable<Usuario> {
    console.log('Ejecuta actualizar usuario');
    console.log(usuario);
    return this.http.post<Usuario>(`${this.host}/usuario/actualizar`, usuario);
  }

  public resetPassword(email: string): Observable<CustomHttpResponse> {
    return this.http.get<CustomHttpResponse>(`${this.host}/usuario/resetPassword/${email}`);
  }

  public actualizarImagenPerfil(formData: FormData): Observable<HttpEvent<Usuario>> {
    return this.http.post<Usuario>(`${this.host}/usuario/actualizarImagenPerfil`, formData,
      {
        reportProgress: true,
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

  public buscarPorIdentificacion(identificacion: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.host}/usuario/buscar/${identificacion}`);
  }

  public buscarPorNombreUsuario(nombreUsuario: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.host}/usuario/buscar/${nombreUsuario}`);
  }

  public buscarPorNombreApellido(nombreApellido: UsuarioNombreApellido): Observable<Usuario[]> {
    const params = new HttpParams()
      .set('nombres', nombreApellido.nombre)
      .set('apellidos', nombreApellido.apellido);
    return this.http.post<Usuario[]>(
      `${this.host}/usuario/buscarNombresApellidos?`,
      {},
      {params}
    );
  }

  public buscarPorCorreo(correo: string): Observable<Usuario[]> {
    const params = new HttpParams()
      .set('correo', correo);
    return this.http.post<Usuario[]>(
      `${this.host}/usuario/buscarCorreo?`,
      {},
      {params}
    );
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
