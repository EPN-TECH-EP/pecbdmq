import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Inscripcion} from "../../modelo/flujos/formacion/inscripcion";
import {Requisito} from "../../modelo/admin/requisito";
import {UsuarioAsignado} from "../../modelo/flujos/formacion/asignar-usuario";

@Injectable({
  providedIn: 'root'
})
export class ValidacionInscripcionService {

  private host = environment.apiUrl

  constructor(private http: HttpClient) {
  }

  listarInscripciones(idUsuario: number) {
    const params = {page: '0', size: '10'}
    return this.http.get<Inscripcion[]>(`${this.host}/inscripcionfor/postulantesPaginado/${idUsuario}`, {params});
  }

  asignarValidador(usuarioAsignado: UsuarioAsignado) {
    return this.http.put<Inscripcion>(`${this.host}/inscripcionfor/postulante`, usuarioAsignado);
  }

  getPostulante(id: number) {
    return this.http.get<Inscripcion>(`${this.host}/inscripcionfor/postulante/${id}`);
  }


}
