import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

export interface EspDelegado {
  codEspDelegado: number;
  codUsuario: number;
  codDatosPersonales: number;
  estado: string;
  cedula: number;
  nombre: string;
  apellido: string;
}

export interface EspDelegadoCreate {
  codUsuario: number,
  estado: string
}

@Injectable({
  providedIn: 'root'
})
export class EspDelegadoService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  listar() {
    return this.http.get<EspDelegado[]>(`${this.host}/delegadoEsp/obtenerDelegado`);
  }

  asignar(delegado: EspDelegadoCreate) {
    return this.http.post<EspDelegado>(`${this.host}/delegadoEsp/crear`, delegado);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.host}/delegadoEsp/${id}`);
  }
  esDelegado(id: number) {
    return this.http.get(`${this.host}/delegadoEsp/esDelegado/${id}`);
  }

}
