import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse,} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {EstudianteSemestreMateria} from '../../modelo/admin/profesionalizacion/estudiante-semestre-materia';

@Injectable({
  providedIn: 'root'
})
export class ProEstudianteSemestreMateriaService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public listar(): Observable<EstudianteSemestreMateria[]> {
    return this.http.get<EstudianteSemestreMateria[]>(`${this.host}/proEstudianteSemestreMateria/listar`);
  }

  public crear(estudianteSemestreMateria: EstudianteSemestreMateria): Observable<HttpResponse<EstudianteSemestreMateria>> {
    return this.http.post<EstudianteSemestreMateria>(`${this.host}/proEstudianteSemestreMateria/crear`, estudianteSemestreMateria, {observe: 'response'});
  }

  public actualizar(estudianteSemestreMateria: EstudianteSemestreMateria, codSemestre: any):
    Observable<HttpResponse<EstudianteSemestreMateria>> {
    return this.http.put<EstudianteSemestreMateria>(`${this.host}/proEstudianteSemestreMateria/${codSemestre}`,
      estudianteSemestreMateria, {observe: 'response'});
  }

  public eliminar(codSemestre: any): Observable<string> {
    return this.http.delete<any>(`${this.host}/proEstudianteSemestreMateria/${codSemestre}`);
  }

  public getEstudianteBySemestreAndMateria(codMateria: string, codSemestre: string): Observable<EstudianteSemestreMateria[]> {
    return this.http.get<any>(`${this.host}/proEstudianteSemestreMateria/${codSemestre}/${codMateria}`);
  }
}
