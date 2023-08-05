import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { DatoPersonal } from "../../modelo/admin/dato-personal";
import { Estudiante } from "../../modelo/flujos/Estudiante";

export interface PostulanteEspecializacion {
  datoPersonal: DatoPersonal;
  estudiante: Estudiante;
}

@Injectable({
  providedIn: 'root'
})
export class EspInscripcionService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  obtenerDatosDelPostulante(cedula: string) {
    return this.http.get<PostulanteEspecializacion>(`${ this.host }/inscripcionEsp/informacion/${ cedula }`);
  }

  // obtener lista de inscritos por curso
  // endpoint: inscripcionEsp/porCurso/{codCurso}

}
