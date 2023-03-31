import { Ponderacion } from './../modelo/ponderacion';
import { Injectable } from '@angular/core';
import { HttpClient,HttpResponse, HttpErrorResponse,HttpEvent,} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CustomHttpResponse } from '../modelo/custom-http-response';


@Injectable({providedIn: 'root',})

export class PonderacionService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getPonderacion(): Observable<Ponderacion[]> {
    return this.http.get<Ponderacion[]>(`${this.host}/ponderacion/listartodo`);
  }

  public registroPonderacion(ponderacion: Ponderacion): Observable<HttpResponse<Ponderacion>> {
    return this.http.post<Ponderacion>(`${this.host}/ponderacion/crear`, ponderacion, { observe: 'response' });
  }

    public eliminarPonderacion(codigo: number): Observable<string> {
    return this.http.delete<string>(`${this.host}/ponderacion/${codigo}`);
    }
   public actualizarPonderacion(ponderacion: Ponderacion, codigo:any): Observable<HttpResponse<Ponderacion>> {
    return this.http.put<Ponderacion>(`${this.host}/ponderacion/${codigo}`, ponderacion, { observe: 'response' });
  }
  // public agregarSemestresACacheLocal(Semestres: Semestre[]): void {
  //   localStorage.setItem('semestres', JSON.stringify(Semestres));
  // }




}
