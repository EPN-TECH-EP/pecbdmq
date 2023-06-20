import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { TipoInstruccion } from "../modelo/admin/tipo_instruccion";

@Injectable({
  providedIn: 'root'
})
export class TipoInstruccionService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(): Observable<TipoInstruccion[]> {
    return this.http.get<TipoInstruccion[]>(`${ this.host }/tipoinstruccion/listar`);
  }

  crear(tipoInstruccion: TipoInstruccion): Observable<HttpResponse<TipoInstruccion>> {
    return this.http.post<TipoInstruccion>(`${ this.host }/tipoinstruccion/crear`, tipoInstruccion, { observe: 'response' });
  }

  actualizar(tipoInstruccion: TipoInstruccion, tipoInstruccionId: any): Observable<HttpResponse<TipoInstruccion>> {
    return this.http.put<TipoInstruccion>(`${ this.host }/tipoinstruccion/${ tipoInstruccionId }`, tipoInstruccion, { observe: 'response' });
  }

  eliminar(tipoInstruccionId: any): Observable<string> {
    return this.http.delete<string>(`${ this.host }/tipoinstruccion/${ tipoInstruccionId }`);
  }
}
