import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Etapas} from "../../modelo/admin/profesionalizacion/pro-etapas";

@Injectable({
  providedIn: 'root',
})
export class EtapaService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  listar(): Observable<Etapas[]> {
    return this.http.get<Etapas[]>(`${this.host}/proEtapas/listar`);
  }

  crear(etapas: Etapas): Observable<HttpResponse<Etapas>> {
    return this.http.post<Etapas>(`${this.host}/proEtapas/crear`, etapas, {observe: 'response'});
  }

  eliminar(codEtapa: number): Observable<string> {
    return this.http.delete<string>(`${this.host}/proEtapas/${codEtapa}`);
  }

  actualizar(etapas: Etapas, codEtapa: any): Observable<HttpResponse<Etapas>> {
    return this.http.put<Etapas>(`${this.host}/proEtapas/${codEtapa}`, etapas, {observe: 'response'});
  }

  getMateriaBySemestre(etapas: number): Observable<Etapas[]> {
    return this.http.get<Etapas[]>(
      `https://epnsandbox.free.beeceptor.com/proEtapas/materiasbysemestre/${etapas}`); // TODO replace baseurl
  }
}

