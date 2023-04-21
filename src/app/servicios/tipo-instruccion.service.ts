import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {TipoInstruccion} from "../modelo/admin/tipo_instruccion";
@Injectable({
  providedIn: 'root'
})
export class TipoInstruccionService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}
  public getTipoInstruccion(): Observable<TipoInstruccion[]> {
    return this.http.get<TipoInstruccion[]>(`${this.host}/tipoinstruccion/listar`);
  }

  public crearTipoInstruccion(tipoInstruccion: TipoInstruccion): Observable<HttpResponse<TipoInstruccion>> {
    return this.http.post<TipoInstruccion>(`${this.host}/tipoinstruccion/crear`, tipoInstruccion, { observe: 'response' });
  }

  public actualizarTipoInstruccion(tipoInstruccion: TipoInstruccion, tipoInstruccionId:any): Observable<HttpResponse<TipoInstruccion>> {
    return this.http.put<TipoInstruccion>(`${this.host}/tipoinstruccion/${tipoInstruccionId}`, tipoInstruccion, { observe: 'response' });
  }

  public eliminarTipoInstruccion(tipoInstruccionId: any): Observable<string> {
    return this.http.delete<string>(`${this.host}/tipoinstruccion/${tipoInstruccionId}`);
  }
}
