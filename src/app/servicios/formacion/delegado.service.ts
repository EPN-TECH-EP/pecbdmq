import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

export interface Delegado {

  cod_usuario: number;
  cod_datos_personales: number;
  estado: string;
  cedula: number;
  nombre: string;
  apellido: string;
}

export interface DelegadoCreate {
  codUsuario: number,
  codPeriodoAcademico: number,
  estado: string
}

@Injectable({
  providedIn: 'root'
})
export class DelegadoService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  listar() {
    return this.http.get<Delegado[]>(`${this.host}/delegado/obtenerdelegado`);
  }

  asignar(delegado: DelegadoCreate) {
    return this.http.post<Delegado>(`${this.host}/delegado/crear`, delegado);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.host}/delegado/${id}`);
  }
  esDelegado(id: number) {
    return this.http.get(`${this.host}/delegado/esDelegado/${id}`);
  }

}
