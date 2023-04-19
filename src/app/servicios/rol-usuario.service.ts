import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RolUsuario } from '../modelo/admin/rol-usuario';

@Injectable({
  providedIn: 'root'
})
export class RolUsuarioService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getRolUsuario(): Observable<RolUsuario[]> {
    return this.http.get<RolUsuario[]>(`${this.host}/rolUsuario/listar`);
  }

  public getRolUsuarioPorUsuario(codUsuario: string): Observable<RolUsuario[]> {
    console.log('getRolUsuarioPorUsuario codUsuario: ' + codUsuario);
    return this.http.get<RolUsuario[]>(`${this.host}/rolUsuario/listar/${codUsuario}`);
  }

  public registroRolUsuario(rolUsuario: RolUsuario): Observable<HttpResponse<RolUsuario>> {
    return this.http.post<RolUsuario>(`${this.host}/rolUsuario/crear`, rolUsuario, {
      observe: 'response',
    });
  }

  public eliminarRolUsuario(codigo: any): Observable<string> {
    return this.http.delete<any>(`${this.host}/rolUsuario/${codigo}`);
  }
  public actualizarRolUsuario(
    rolUsuario: RolUsuario
  ): Observable<HttpResponse<RolUsuario>> {
    return this.http.put<RolUsuario>(`${this.host}/rolUsuario/actualizar`, rolUsuario, {
      observe: 'response',
    });
  }

  public asignarRolUsuario(listaRolUsuario: RolUsuario[]): Observable<HttpResponse<RolUsuario>> {
    return this.http.post<RolUsuario>(`${this.host}/rolUsuario/asignar`, listaRolUsuario, {
      observe: 'response',
    });
  }
}
