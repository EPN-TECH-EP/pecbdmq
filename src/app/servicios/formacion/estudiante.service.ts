import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ArchivoService } from "../archivo.service";
import { InscripcionItem } from "../../modelo/flujos/formacion/inscripcion-item";
import { InscripcionCompleta } from "../../modelo/flujos/formacion/inscripcion-completa";
import { Estudiante } from "../../modelo/flujos/Estudiante";
import { Paralelo } from "../../modelo/admin/paralelo";


export interface EstudianteParaleloRequest {
  lista: {
    codUnico: string;
    nombre: string;
    cedula: string;
    telefono: string;
  }[],
  codParalelo: number;
}

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  private host = environment.apiUrl


  constructor(private http: HttpClient) {
  }

  listar() {
    return this.http.get<Estudiante[]>(`${ this.host }/estudiante/listarPA`);
  }

  getEstudianteById(idEstudiante: number) {
    return this.http.get<Estudiante>(`${ this.host }/estudiantes/${ idEstudiante }`);
  }

  asignarEstudianteMateriaParalelo(request: EstudianteParaleloRequest) {
    return this.http.post(`${ this.host }/estudianteMateriaParalelo/asignar`, request);
  }

  listarParalelosActivos(){
    return this.http.get<Paralelo[]>(`${ this.host }/paralelo/listarPA`);
  }
}
