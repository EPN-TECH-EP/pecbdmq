import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { FormacionInstructor } from "../../modelo/dto/formacion-instructor.dto";
import { Aula } from "../../modelo/admin/aula";
import { FormacionEstudiante } from "../../modelo/dto/formacion-usuario.dto";
import { Estudiante } from "../../modelo/flujos/Estudiante";
import { NotaMateriaPorEstudiante } from "../formacion/estudiante.service";

@Injectable({
  providedIn: 'root'
})
export class FormacionHistoricoService {

  private host = environment.apiUrl;
  nota: NotaMateriaPorEstudiante;

  constructor(private http: HttpClient) {
    this.nota = null
  }

  listarNotasPorMateria(idEstudiante: number){
      const params: HttpParams = new HttpParams().set('codEstudiante', idEstudiante.toString());
      return this.http.get<NotaMateriaPorEstudiante[]>(`${ this.host }/notasFormacion/listarNotaMateriaCoordinadorByEstudiante`, { params });
  }

  getMateriasFormacionHistoricosIn(codInstructor: number): Observable<FormacionInstructor[]> {
    const params = new HttpParams()
      .set('codInstructor', codInstructor);
    return this.http.post<FormacionInstructor[]>(
      `${ this.host }/historicoFor/instructor?`,
      {},
      { params }
    );
  }

  getMateriasGeneral(): Observable<Array<unknown>> {
    return this.http.get<Array<unknown>>(`${ this.host }/historicoFor/materias`);
  }

  esEstudiante(codUsuario: number) {
    const params = new HttpParams()
      .set('codUsuario', codUsuario);
    return this.http.get<Estudiante>(`${ this.host }/estudiante/byUser`, { params });
  }

  obtenerEstudianteFormacion(codUsuario: number) {
    const params = new HttpParams()
      .set('codUsuario', codUsuario);
    return this.http.get<FormacionEstudiante>(`${ this.host }/estudiante/byUserFor`, { params });
  }



  obtenerEstudianteProfesionalizacion(codUsuario: number) {
    const params = new HttpParams()
      .set('codUsuario', codUsuario);
    return this.http.get<Estudiante>(`${ this.host }/estudiante/byUserPro`, { params });
  }



}
