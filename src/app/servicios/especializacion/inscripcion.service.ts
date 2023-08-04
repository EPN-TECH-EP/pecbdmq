import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import { InscripcionEsp } from 'src/app/modelo/flujos/especializacion/inscripcion-esp';
import { InscripcionCompletaEsp } from 'src/app/modelo/flujos/especializacion/inscripcion-completa-esp';
import { ValidacionRequisitoEsp } from 'src/app/modelo/flujos/especializacion/requisito';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {

  idInscripcion: number | null

  private host = environment.apiUrl

  constructor(private http: HttpClient) {
    this.idInscripcion = null
  }

  listarInscripciones() {
    return this.http.get<InscripcionEsp[]>(`${this.host}/inscripcionEsp/listarPaginado`);
  }

  listarInscripcionesByIdUsuario(idUsuario: number) {
    const params = {page: '0', size: '50'}
    return this.http.get<InscripcionEsp[]>(`${this.host}/inscripcionEsp/listarPorUsuarioPaginado/${idUsuario}`, {params});
  }

  asignarValidador(idInscripcion: number, idUsuario: number) {
    return this.http.put<InscripcionEsp>(`${this.host}/inscripcionEsp/${idInscripcion}/asignarDelegado/${idUsuario}`, {});
  }

  getInscripcion(idInscripcion: number) {
    return this.http.get<InscripcionCompletaEsp>(`${this.host}/inscripcionEsp/${idInscripcion}`);
  }

  listarRequisitos(idInscripcion: number) {
    return this.http.get<ValidacionRequisitoEsp[]>(`${this.host}/inscripcionEsp/requisitos/${idInscripcion}`);
  }

  guardarRequisitos(requisitos: ValidacionRequisitoEsp[]) {
    return this.http.put<ValidacionRequisitoEsp[]>(`${this.host}/inscripcionEsp/validacionRequisitos`, requisitos);
  }

}
