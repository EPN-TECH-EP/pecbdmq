import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Paralelo} from '../../modelo/admin/paralelo';

@Injectable({
  providedIn: 'root'
})
export class ProParaleloService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getParalelos(): Observable<Paralelo[]> {
    return this.http.get<Paralelo[]>(`${this.host}/proParalelo/listar`);
  }

  public registroParalelo(paralelo: Paralelo): Observable<HttpResponse<Paralelo>> {
    return this.http.post<Paralelo>(`${this.host}/proParalelo/crear`, paralelo, {observe: 'response'});
  }

  public eliminarParalelo(codParalelo: number): Observable<string> {
    return this.http.delete<string>(`${this.host}/proParalelo/${codParalelo}`);
  }

  public actualizarParalelo(paralelo: Paralelo, codParalelo: any): Observable<HttpResponse<Paralelo>> {
    return this.http.put<Paralelo>(`${this.host}/proParalelo/${codParalelo}`, paralelo, {observe: 'response'});
  }
}
