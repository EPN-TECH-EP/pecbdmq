import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Materia} from '../../modelo/admin/materias';
import {EjeMateriaDto} from "../../modelo/flujos/profesionalizacion/eje-materia.models";
import {ProMateriaSemestreDto} from "../../modelo/flujos/profesionalizacion/pro-materia-semestre.models";

@Injectable({
  providedIn: 'root',
})
export class ProMateriaService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  listar(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.host}/proMateria/listar`);
  }

  crear(materia: Materia): Observable<HttpResponse<Materia>> {
    return this.http.post<Materia>(`${this.host}/proMateria/crear`, materia, {observe: 'response'});
  }

  eliminar(codMateria: number): Observable<string> {
    return this.http.delete<string>(`${this.host}/proMateria/${codMateria}`);
  }

  actualizar(materia: Materia, codMateria: any): Observable<HttpResponse<Materia>> {
    return this.http.put<Materia>(`${this.host}/proMateria/${codMateria}`, materia, {observe: 'response'});
  }

  getMateriaBySemestre(semestre: number): Observable<Materia[]> {
    return this.http.get<Materia[]>(
      `https://epnsandbox.free.beeceptor.com/proMateria/materiasbysemestre/${semestre}`); // TODO replace baseurl
  }

  ejeMaterias() {
    return this.http.get<EjeMateriaDto[]>(`${this.host}/proMateria/ejeMaterias`);
  }

  getByAll(id1: number, id2: number): Observable<ProMateriaSemestreDto[]> {
    return this.http.get<ProMateriaSemestreDto[]>(`${this.host}/proMateria/filtrar/${id1}/${id2}`);
  }
}

