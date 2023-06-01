import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {InscripcionItem} from "../../modelo/flujos/formacion/inscripcion-item";
import {Requisito} from "../../modelo/admin/requisito";
import {UsuarioAsignado} from "../../modelo/flujos/formacion/asignar-usuario";
import {ValidacionRequisito} from "../../modelo/flujos/formacion/requisito";
import {InscripcionCompleta} from "../../modelo/flujos/formacion/inscripcion-completa";
import {ArchivoService} from "../archivo.service";

@Injectable({
  providedIn: 'root'
})
export class ValidacionInscripcionService {

  private host = environment.apiUrl

  constructor(private http: HttpClient, private archivoService: ArchivoService) {
  }

  listarInscripciones(idUsuario: number) {
    const params = {page: '0', size: '10'}
    return this.http.get<InscripcionItem[]>(`${this.host}/inscripcionfor/postulantesPaginado/${idUsuario}`, {params});
  }

  asignarValidador(usuarioAsignado: UsuarioAsignado) {
    return this.http.put<InscripcionItem>(`${this.host}/inscripcionfor/postulante`, usuarioAsignado);
  }

  getInscripcion(id: number) {
    return this.http.get<InscripcionCompleta>(`${this.host}/inscripcionfor/datos/${id}`);
  }

  listarRequisitos(codigoPostulante: number) {
    return this.http.get<ValidacionRequisito[]>(`${this.host}/inscripcionfor/requisitos/${codigoPostulante}`);
  }

  guardarRequisitos(requisitos: ValidacionRequisito[]) {
    return this.http.put<ValidacionRequisito[]>(`${this.host}/inscripcionfor/requisitosUpdate`, requisitos);
  }

}
