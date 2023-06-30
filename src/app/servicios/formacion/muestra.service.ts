import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ArchivoService } from "../archivo.service";
import { Observable } from "rxjs";
import { MateriaFormacion } from "./materias-formacion.service";
import { InscripcionItem } from "../../modelo/flujos/formacion/inscripcion-item";

@Injectable({
  providedIn: 'root'
})
export class MuestraService {

  private host = environment.apiUrl

  idPostulante: number;

  constructor(private http: HttpClient, private archivoService: ArchivoService) {
  }

  listarMuestrasByIdUsuario(){
    return this.http.get<InscripcionItem[]>(`${ this.host }/inscripcionfor/getMuestra`);
    // return 'Lista de las muestras'
  }


}
