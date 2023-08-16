import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse,} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {EstudianteSemestre} from '../../modelo/admin/estudiante-semestre';

@Injectable({
  providedIn: 'root'
})
export class ProEstudianteSemestreService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public listar(): Observable<EstudianteSemestre[]> {
    return this.http.get<EstudianteSemestre[]>(`${this.host}/proEstudianteSemestre/listar`);
  }

  public listarAsignados(codSemestre: any): Observable<EstudianteSemestre[]> {
    return this.http.get<EstudianteSemestre[]>(`${this.host}/proEstudianteSemestre/${codSemestre}/listar`);
  }

  public crear(semestre: EstudianteSemestre): Observable<HttpResponse<EstudianteSemestre>> {
    return this.http.post<EstudianteSemestre>(`${this.host}/proEstudianteSemestre/crear`, semestre, {observe: 'response'});
  }

  public actualizar(semestre: EstudianteSemestre, codSemestre: any): Observable<HttpResponse<EstudianteSemestre>> {
    return this.http.put<EstudianteSemestre>(`${this.host}/proEstudianteSemestre/${codSemestre}`, semestre, {observe: 'response'});
  }

  public eliminar(codSemestre: any): Observable<string> {
    return this.http.delete<any>(`${this.host}/proEstudianteSemestre/${codSemestre}`);
  }

  public mostrar1Semestre(codSemestre: any): Observable<string> {
    return this.http.get<any>(`${this.host}/semestre/${codSemestre}`);
  }

}
