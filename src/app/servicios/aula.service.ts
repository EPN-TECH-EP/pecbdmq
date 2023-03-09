import { Aula } from './../modelo/Aula';
import { Injectable } from '@angular/core';
import { HttpClient,HttpResponse, HttpErrorResponse,HttpEvent,} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CustomHttpResponse } from '../modelo/custom-http-response';

@Injectable({providedIn: 'root',})

export class AulaService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getAula(): Observable<Aula[]> {
    return this.http.get<Aula[]>(`${this.host}/aula/listar`);
  }

  public registroAula(aula: Aula): Observable<HttpResponse<Aula>> {
    return this.http.post<Aula>(`${this.host}/aula/crear`, aula, { observe: 'response' });
  }

    public eliminarAula(codigo: number): Observable<string> {
    return this.http.delete<string>(`${this.host}/aula/${codigo}`);
    }
   public actualizarAula(aula: Aula, codigo:any): Observable<HttpResponse<Aula>> {
    return this.http.put<Aula>(`${this.host}/aula/${codigo}`, aula, { observe: 'response' });
  }

  // public obtenerUsuariosDeCacheLocal(): Aula[] {
  //   if (localStorage.getItem('materias')) {
  //       return JSON.parse(localStorage.getItem('materias'));
  //   }
  //   return null;
  // }
}

