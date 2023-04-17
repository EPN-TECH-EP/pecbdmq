import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MenuRol } from '../modelo/admin/menu-rol';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuRolService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getMenuRol(): Observable<MenuRol[]> {
    return this.http.get<MenuRol[]>(`${this.host}/menuRol/listar`);
  }

  public getMenuRolPorRol(codRol: number): Observable<MenuRol[]> {
    return this.http.get<MenuRol[]>(`${this.host}/menuRol/listar/${codRol}`);
  }

  public registroMenuRol(menuRol: MenuRol): Observable<HttpResponse<MenuRol>> {
    return this.http.post<MenuRol>(`${this.host}/menuRol/crear`, menuRol, {
      observe: 'response',
    });
  }

  public eliminarMenuRol(codigo: any): Observable<string> {
    return this.http.delete<any>(`${this.host}/menuRol/${codigo}`);
  }
  public actualizarMenuRol(
    menuRol: MenuRol
  ): Observable<HttpResponse<MenuRol>> {
    return this.http.put<MenuRol>(`${this.host}/menuRol/actualizar`, menuRol, {
      observe: 'response',
    });
  }

  public asignarMenuRol(listaMenuRol: MenuRol[]): Observable<HttpResponse<MenuRol>> {
    return this.http.post<MenuRol>(`${this.host}/menuRol/asignar`, listaMenuRol, {
      observe: 'response',
    });
  }
}
