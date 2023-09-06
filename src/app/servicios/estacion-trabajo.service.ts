import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";

export interface EstacionTrabajo {
  codigo: number;
  nombre: string;
  canton: number;
  estado: string;
}

export interface EstacionTrabajoDto {
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

  listar(): Observable<EstacionTrabajoDto[]> {
    return this.http.get<EstacionTrabajoDto[]>(`${ this.host }/listar`);
  }

  crear(estacion: EstacionTrabajo): Observable<HttpResponse<EstacionTrabajoDto>> {
    return this.http.post<EstacionTrabajoDto>(`${ this.host }/crear`, estacion, { observe: 'response' });
  }

  actualizar(estacion: EstacionTrabajo, estacionId: any): Observable<HttpResponse<EstacionTrabajoDto>> {
    return this.http.put<EstacionTrabajoDto>(`${ this.host }/${ estacionId }`, estacion, { observe: 'response' });
  }

  eliminar(estacionId: any): Observable<string> {
    return this.http.delete<string>(`${ this.host }/${ estacionId }`);
  }

}
