import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse,} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {EstSemMatParalelo} from '../../modelo/admin/profesionalizacion/est-sem-mat-paralelo';

@Injectable({
  providedIn: 'root'
})
export class ProEstSemMatParaleloService{
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public listar(): Observable<EstSemMatParalelo[]> {
    // return this.http.get<EstSemMatParalelo[]>(`${this.host}/proEstudianteSemestreMateriaParalelo/listar`);
    return this.http.get<EstSemMatParalelo[]>(`${this.host}/proEstudianteSemestreMateriaParalelo/listar`);
  }

  public crear(estudianteSemestreMateria: EstSemMatParalelo): Observable<HttpResponse<EstSemMatParalelo>> {
    return this.http.post<EstSemMatParalelo>(`${this.host}/proEstudianteSemestreMateriaParalelo/crear`,
      estudianteSemestreMateria, {observe: 'response'});
  }

  public actualizar(estudianteSemestreMateria: EstSemMatParalelo, codSemestre: any):
    Observable<HttpResponse<EstSemMatParalelo>> {
    return this.http.put<EstSemMatParalelo>(`${this.host}/proEstudianteSemestreMateriaParalelo/${codSemestre}`,
      estudianteSemestreMateria, {observe: 'response'});
  }

  public eliminar(codSemestre: any): Observable<string> {
    return this.http.delete<any>(`${this.host}/proEstudianteSemestreMateriaParalelo/${codSemestre}`);
  }


}
