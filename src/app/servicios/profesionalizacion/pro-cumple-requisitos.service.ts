import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {InscripcionItem} from "../../modelo/flujos/formacion/inscripcion-item";
import {Requisito} from "../../modelo/admin/requisito";
import {UsuarioAsignado} from "../../modelo/flujos/formacion/asignar-usuario";
import {ValidacionRequisito} from "../../modelo/flujos/formacion/requisito";
import {InscripcionCompleta} from "../../modelo/flujos/formacion/inscripcion-completa";
import {ArchivoService} from "../archivo.service";
import {ProCumpleRequisitosDto} from "../../modelo/flujos/profesionalizacion/pro-cumple-requisitos.models";

@Injectable({
  providedIn: 'root'
})
export class ProCumpleRequisitosService {

  idPostulante: number | null

  private host = environment.apiUrl

  constructor(private http: HttpClient, private archivoService: ArchivoService) {
    this.idPostulante = null
  }

  listarInscripciones() {
    const params = {page: '0', size: '50'}
    return this.http.get<InscripcionItem[]>(`${this.host}/proInscripcion/postulantesAllPaginado`);
  }

  listarInscripcionesByIdUsuario(idUsuario: number) {
    const params = {page: '0', size: '50'}
    return this.http.get<InscripcionItem[]>(`${this.host}/proInscripcion/postulantesPaginado/${idUsuario}`, {params});
  }

  asignarValidador(usuarioAsignado: UsuarioAsignado) {
    return this.http.put<InscripcionItem>(`${this.host}/proInscripcion/postulanteAsignar`, usuarioAsignado);
  }

  getInscripcion(idPostulante: number) {
    return this.http.get<InscripcionCompleta>(`${this.host}/proInscripcion/datos/${idPostulante}`);
  }

  listarRequisitos(codigoPostulante: number) {
    return this.http.get<ProCumpleRequisitosDto[]>(`${this.host}/proInscripcion/requisitos/${codigoPostulante}`);
  }

  guardarRequisitos(requisitos: ProCumpleRequisitosDto[]) {
    return this.http.post<ValidacionRequisito[]>(`${this.host}/proCumpleRequisistos/actualizaRequisitos`, requisitos);
  }

  reasignarInscripcion(usuarioAsignado: UsuarioAsignado) {
    return this.http.put<InscripcionItem>(`${this.host}/proInscripcion/postulanteAsignar`, usuarioAsignado);
  }
}
