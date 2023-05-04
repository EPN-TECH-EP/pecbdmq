import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Paralelo} from "../modelo/admin/paralelo";


@Injectable({
  providedIn: 'root'
})
export class ParaleloService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getParalelos(): Observable<Paralelo[]> {
    return this.http.get<Paralelo[]>(`${this.host}/paralelo/listar`);
  }

  public registroParalelo(paralelo: Paralelo): Observable<HttpResponse<Paralelo>> {
    return this.http.post<Paralelo>(`${this.host}/paralelo/crear`, paralelo, { observe: 'response' });
  }

  public eliminarParalelo(codParalelo: number): Observable<string> {
    return this.http.delete<string>(`${this.host}/paralelo/${codParalelo}`);
  }
  public actualizarParalelo(paralelo: Paralelo, codParalelo:any): Observable<HttpResponse<Paralelo>> {
    return this.http.put<Paralelo>(`${this.host}/paralelo/${codParalelo}`, paralelo, { observe: 'response' });
  }
}
