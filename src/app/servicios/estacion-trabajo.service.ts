import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";

export interface EstacionTrabajo {
  codigo: number;
  nombre: string;
  nombreCanton: string;
  nombreProvincia: string;
  provincia: number;
  canton: number;
  estado: string;
}


@Injectable({
  providedIn: 'root'
})
export class EstacionTrabajoService {

  private host = environment.apiUrl + '/estacionTrabajo';

  constructor(private http: HttpClient) {}

  listar(): Observable<EstacionTrabajo[]> {
    return this.http.get<EstacionTrabajo[]>(`${ this.host }/listar`);
  }

  crear(estacion: EstacionTrabajo): Observable<HttpResponse<EstacionTrabajo>> {
    return this.http.post<EstacionTrabajo>(`${ this.host }/crear`, estacion, { observe: 'response' });
  }

  actualizar(estacion: EstacionTrabajo, estacionId: any): Observable<HttpResponse<EstacionTrabajo>> {
    return this.http.put<EstacionTrabajo>(`${ this.host }/${ estacionId }`, estacion, { observe: 'response' });
  }

  eliminar(estacionId: any): Observable<string> {
    return this.http.delete<string>(`${ this.host }/${ estacionId }`);
  }

}
