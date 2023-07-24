import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { InscripcionItem } from "../../modelo/flujos/formacion/inscripcion-item";
import { InscripcionCompleta } from "../../modelo/flujos/formacion/inscripcion-completa";
import { ValidacionRequisito } from "../../modelo/flujos/formacion/requisito";

@Injectable({
  providedIn: 'root'
})
export class MuestraService {

  private host = environment.apiUrl

  idMuestra: number;

  constructor(private http: HttpClient) {
  }

  listarByIdUsuario(idUsuario: number) {
    const params = { page: '0', size: '50' }
    return this.http.get<InscripcionItem[]>(`${ this.host }/inscripcionfor/muestraPostulantesPaginado/${ idUsuario }`, { params });
  }

  getMuestra(idPostulante: number) {
    return this.http.get<InscripcionCompleta>(`${ this.host }/inscripcionfor/datos/${ idPostulante }`);
  }

  guardarRequisitos(requisitos: ValidacionRequisito[]) {
    return this.http.put<ValidacionRequisito[]>(`${ this.host }/inscripcionfor/requisitosUpdate`, requisitos);
  }

}
