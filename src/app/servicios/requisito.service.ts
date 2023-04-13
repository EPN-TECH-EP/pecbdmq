import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Requisito } from '../modelo/requisito';

@Injectable({
  providedIn: 'root'
})
export class RequisitoService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getRequisito(): Observable<Requisito[]> {
    return this.http.get<Requisito[]>(`${this.host}/requisito/listar`);
  }

  public crearRequisito(requisito: Requisito): Observable<HttpResponse< Requisito>> {
    return this.http.post<Requisito>(`${this.host}/requisito/crear`, requisito, { observe: 'response' });
  }
  public actualizarRequisito(requisito: Requisito, codigo:any): Observable<HttpResponse<Requisito>> {
    return this.http.put<Requisito>(`${this.host}/requisito/${codigo}`, requisito, { observe: 'response' });
  }

  public eliminarRequisito(codigoRequisito: any): Observable<string> {
    return this.http.delete<any>(`${this.host}/requisito/${codigoRequisito}`);
    }
    // public mostrar1Semestre(codSemestre: any): Observable<string> {
    //   return this.http.get<any>(`${this.host}/semestre/${codSemestre}`);
    //   }
}
