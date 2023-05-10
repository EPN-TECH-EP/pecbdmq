import {Provincia} from '../modelo/admin/provincia';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Canton} from "../modelo/admin/canton";

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getProvincias(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(`${this.host}/provincia/listar`);
  }

  getCantonesPorProvincia(idProvincia: number): Observable<Canton[]> {
    return this.http.get<Canton[]>(`${this.host}/canton/provincia/${idProvincia}`);
  }

  getCantones(): Observable<Canton[]> {
    return this.http.get<Canton[]>(`${this.host}/canton/listar`);
  }

}
