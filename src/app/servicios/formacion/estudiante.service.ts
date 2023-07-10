import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ArchivoService } from "../archivo.service";
import { InscripcionItem } from "../../modelo/flujos/formacion/inscripcion-item";
import { InscripcionCompleta } from "../../modelo/flujos/formacion/inscripcion-completa";
import { Estudiante } from "../../modelo/flujos/Estudiante";

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  private host = environment.apiUrl


  constructor(private http: HttpClient, private archivoService: ArchivoService) {
  }

  listar() {
    return this.http.get<Estudiante[]>(`${ this.host }/estudiante/listarPA`);
  }

  getEstudianteById(idEstudiante: number) {
    return this.http.get<Estudiante>(`${ this.host }/estudiantes/${ idEstudiante }`);
  }
}
