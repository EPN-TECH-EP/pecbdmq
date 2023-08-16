import {ProfesionalizacionService} from "./profesionalizacion.service";
import {Observable} from "rxjs";
import {Usuario} from "../../modelo/admin/usuario";
import {UsuarioNombreApellido} from "../../modelo/util/nombre-apellido";
import {HttpParams} from "@angular/common/http";

export class ProfesionalizacionBuscarService<T, U> extends ProfesionalizacionService<T, U> {
  public buscarPorIdentificacion(identificacion: string): Observable<T> {
    return this.http.get<T>(`${this.host}${this.path}/buscar/identificacion/${identificacion}`);
  }

  public buscarPorNombreApellido(nombreApellido: UsuarioNombreApellido): Observable<T[]> {
    return this.http.get<T[]>(`${this.host}${this.path}/buscar/datos?nombre=${nombreApellido.nombre}&apellido=${nombreApellido.apellido}`);
  }

  public buscarPorCorreo(correo: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.host}${this.path}/buscar/correo/${correo}`);
  }

}
