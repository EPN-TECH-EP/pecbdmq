import { Aula } from '../modelo/admin/aula';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root', })

export class AulaService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(): Observable<Aula[]> {
    return this.http.get<Aula[]>(`${ this.host }/aula/listar`);
  }

  crearAula(aula: Aula): Observable<HttpResponse<Aula>> {
    return this.http.post<Aula>(`${ this.host }/aula/crear`, aula, { observe: 'response' });
  }

  eliminarAula(codigo: any): Observable<string> {
    return this.http.delete<any>(`${ this.host }/aula/${ codigo }`);
  }

  actualizarAula(aula: Aula, codigo: any): Observable<HttpResponse<Aula>> {
    return this.http.put<Aula>(`${ this.host }/aula/${ codigo }`, aula, { observe: 'response' });
    }

}

