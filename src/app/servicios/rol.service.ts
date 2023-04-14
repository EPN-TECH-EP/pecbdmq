import { Injectable } from '@angular/core';
import { Rol } from '../modelo/admin/rol';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getRol(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.host}/rol/listar`);
  }

  public registroRol(Rol: Rol): Observable<HttpResponse<Rol>> {
    return this.http.post<Rol>(`${this.host}/rol/crear`, Rol, { observe: 'response' });
  }

    public eliminarRol(codigo: any): Observable<string> {
    return this.http.delete<any>(`${this.host}/rol/${codigo}`);
    }
   public actualizarRol(Rol: Rol): Observable<HttpResponse<Rol>> {
    return this.http.put<Rol>(`${this.host}/rol/actualizar`, Rol, { observe: 'response' });
  }
}
