import { TipoPrueba } from '../modelo/tipo-prueba';
import { Injectable } from '@angular/core';
import {HttpClient,HttpResponse, HttpErrorResponse, HttpEvent,} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class TipoPruebaService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getTipoPrueba(): Observable<TipoPrueba[]> {
    return this.http.get<TipoPrueba[]>(`${this.host}/gen_tipo_prueba/listar`);
  }

  public crearTipoPrueba(prueba: TipoPrueba): Observable<HttpResponse< TipoPrueba>> {
    return this.http.post<TipoPrueba>(`${this.host}/gen_tipo_prueba/crear`, prueba, { observe: 'response' });
  }

  public actualizarTipoPrueba(prueba: TipoPrueba,  codPrueba :any): Observable<HttpResponse<TipoPrueba>> {
    return this.http.put<TipoPrueba>(`${this.host}/gen_tipo_prueba/${codPrueba}`, prueba, { observe: 'response' });
  }

  public eliminarTipoPrueba(codPrueba: any): Observable<string> {
    return this.http.delete<any>(`${this.host}/gen_tipo_prueba/${codPrueba}`);
    }


}
