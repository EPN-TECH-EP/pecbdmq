import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {InscripcionItem} from "../../modelo/flujos/formacion/inscripcion-item";
import {UsuarioAsignado} from "../../modelo/flujos/formacion/asignar-usuario";
import {ValidacionRequisito} from "../../modelo/flujos/formacion/requisito";
import {InscripcionCompleta} from "../../modelo/flujos/formacion/inscripcion-completa";

@Injectable({
  providedIn: 'root'
})
export class ValidacionInscripcionService {

  idPostulante: number | null

  private host = environment.apiUrl

  constructor(private http: HttpClient) {
    this.idPostulante = null
  }

  listarInscripciones() {
    return this.http.get<InscripcionItem[]>(`${this.host}/inscripcionfor/postulantesAllPaginado`);
  }

  listarInscripcionesByIdUsuario(idUsuario: number) {
    const params = {page: '0', size: '50'}
    return this.http.get<InscripcionItem[]>(`${this.host}/inscripcionfor/postulantesPaginado/${idUsuario}`, {params});
  }

  asignarValidador(usuarioAsignado: UsuarioAsignado) {
    return this.http.put<InscripcionItem>(`${this.host}/inscripcionfor/postulanteAsignar`, usuarioAsignado);
  }

  getInscripcion(idPostulante: number) {
    return this.http.get<InscripcionCompleta>(`${this.host}/inscripcionfor/datos/${idPostulante}`);
  }

  listarRequisitos(codigoPostulante: number) {
    return this.http.get<ValidacionRequisito[]>(`${this.host}/inscripcionfor/requisitos/${codigoPostulante}`);
  }

  guardarRequisitos(requisitos: ValidacionRequisito[]) {
    return this.http.put<ValidacionRequisito[]>(`${this.host}/inscripcionfor/requisitosUpdate`, requisitos);
  }

  reasignarInscripcion(usuarioAsignado: UsuarioAsignado) {
    return this.http.put<InscripcionItem>(`${this.host}/inscripcionfor/postulanteAsignar`, usuarioAsignado);
  }
}
